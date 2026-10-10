import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip, Box, Card, Typography, IconButton, Tabs, Tab, Switch, FormControlLabel, Checkbox, FormGroup, CircularProgress, Divider
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useFeedback } from '../context/FeedbackContext';
import { adminFetch } from '../utils/adminAuth';
import { getDateOverrides, upsertDateOverride, deleteDateOverride, updateWeeklySchedule } from '../utils/availabilityApi';

const SLOT_TIMES = [
  { time: '09:00:00', label: '9:00 AM' },
  { time: '10:00:00', label: '10:00 AM' },
  { time: '11:00:00', label: '11:00 AM' },
  { time: '12:00:00', label: '12:00 PM' },
  { time: '13:00:00', label: '1:00 PM' },
  { time: '14:00:00', label: '2:00 PM' },
  { time: '15:00:00', label: '3:00 PM' },
  { time: '16:00:00', label: '4:00 PM' },
  { time: '17:00:00', label: '5:00 PM' },
];

const toISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const isSlotInPast = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return false;
  const now = new Date();
  const today = toISODate(now);
  if (dateStr > today) return false;
  if (dateStr < today) return true;
  const [hours, minutes, seconds = 0] = timeStr.split(":").map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, seconds, 0);
  return slotTime <= now;
};

export default function AvailabilityManager() {
  const { showSnackbar } = useFeedback();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  
  const [overrides, setOverrides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set all weekly schedule to TRUE by default once on mount
  useEffect(() => {
    updateWeeklySchedule({
      mondayActive: true, tuesdayActive: true, wednesdayActive: true,
      thursdayActive: true, fridayActive: true, saturdayActive: true,
      sundayActive: true, dayStartTime: '09:00:00', dayEndTime: '17:00:00'
    }).catch(() => {});
  }, []);

  const loadMonthOverrides = useCallback(async () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const start = toISODate(new Date(y, m, 1));
    const end = toISODate(new Date(y, m + 1, 0));

    setLoading(true);
    try {
      const [data, bookingsRes] = await Promise.all([
        getDateOverrides(start, end),
        adminFetch('/api/admin/bookings').then(r => r.json()).catch(() => [])
      ]);
      setOverrides(data);
      setBookings(bookingsRes);
    } catch (err) {
      showSnackbar('Could not load availability for this month', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentDate, showSnackbar]);

  useEffect(() => {
    loadMonthOverrides();
  }, [loadMonthOverrides]);

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const selectedDate = daysInMonth[selectedDayIndex] || daysInMonth[0];
  const isoSelectedDate = selectedDate ? toISODate(selectedDate) : null;
  
  // Find override for selected date
  const overrideForDate = overrides.find(o => o.date === isoSelectedDate);
  const isDayActive = overrideForDate ? !overrideForDate.fullDayBlocked : true;
  const todayISO = toISODate(new Date());
  const isPastDay = isoSelectedDate ? isoSelectedDate < todayISO : false;
  const blockedSlots = overrideForDate && overrideForDate.blockedSlots ? overrideForDate.blockedSlots : [];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDayIndex(0);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDayIndex(0);
  };

  const handleDayToggle = async (e) => {
    const active = e.target.checked;
    try {
      if (!active) {
        // Block full day
        await upsertDateOverride({
          date: isoSelectedDate,
          fullDayBlocked: true,
          blockedSlots: [],
          reason: ''
        });
      } else {
        // Remove override to make it default active
        await deleteDateOverride(isoSelectedDate);
      }
      showSnackbar(`Day marked as ${active ? 'Active' : 'Off'}`, 'success');
      loadMonthOverrides();
    } catch (err) {
      showSnackbar('Failed to update day', 'error');
    }
  };

  const handleSlotToggle = async (time, isChecked) => {
    let newBlocked = [...blockedSlots];
    if (isChecked) {
      // Meaning slot is AVAILABLE -> remove from blocked
      newBlocked = newBlocked.filter(t => t !== time);
    } else {
      // Meaning slot is OFF -> add to blocked
      if (!newBlocked.includes(time)) newBlocked.push(time);
    }

    try {
      if (newBlocked.length === 0) {
        // No slots blocked, just remove override
        await deleteDateOverride(isoSelectedDate);
      } else {
        await upsertDateOverride({
          date: isoSelectedDate,
          fullDayBlocked: false,
          blockedSlots: newBlocked,
          reason: ''
        });
      }
      loadMonthOverrides();
    } catch (err) {
      showSnackbar('Failed to update slot', 'error');
    }
  };

  return (
    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      {/* Month Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <IconButton onClick={handlePrevMonth}><ChevronLeftIcon /></IconButton>
        <Typography variant="h6" fontWeight="700">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton onClick={handleNextMonth}><ChevronRightIcon /></IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 400 }}>
        {/* Left Pane - Vertical Tabs */}
        <Box sx={{ borderRight: { md: '1px solid #e2e8f0' }, borderBottom: { xs: '1px solid #e2e8f0', md: 'none' }, minWidth: 150, maxHeight: 500, overflowY: 'auto' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedDayIndex}
            onChange={(e, val) => setSelectedDayIndex(val)}
            sx={{ borderRight: 1, borderColor: 'divider', minHeight: 400 }}
          >
            {daysInMonth.map((day, idx) => {
              const iso = toISODate(day);
              const isBlocked = overrides.some(o => o.date === iso && o.fullDayBlocked);
              const hasBlockedSlots = overrides.some(o => o.date === iso && !o.fullDayBlocked && o.blockedSlots.length > 0);
              
              let indicator = '';
              if (isBlocked) indicator = ' (OFF)';
              else if (hasBlockedSlots) indicator = ' (Modified)';

              return (
                <Tab 
                  key={iso} 
                  label={`${day.getDate()} ${day.toLocaleString('default', { weekday: 'short' })}${indicator}`}
                  sx={{ alignItems: 'flex-start', py: 1.5, textTransform: 'none', fontWeight: 600, color: isBlocked ? 'error.main' : 'inherit' }}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Right Pane - Content */}
        <Box sx={{ p: 4, flexGrow: 1, position: 'relative' }}>
          {loading && <CircularProgress sx={{ position: 'absolute', top: 20, right: 20 }} size={24} />}
          
          {selectedDate && (
            <Box>
              <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                {selectedDate.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
              
              <FormControlLabel
                control={<Switch checked={isDayActive} disabled={isPastDay} onChange={handleDayToggle} color="primary" />}
                label={<Typography fontWeight="600">{isDayActive ? "Working on this day" : "Taking the day off"}{isPastDay && " (Past day)"}</Typography>}
                sx={{ mb: 4 }}
              />

              {isDayActive && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>Enabled Slots</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <FormGroup>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                      {SLOT_TIMES.map((slot) => {
                        const isSlotBlocked = blockedSlots.includes(slot.time);
                        const slotPast = isSlotInPast(isoSelectedDate, slot.time);
                        const slotBookings = bookings.filter(b => b.bookingDate === isoSelectedDate && b.slotStartTime === slot.time);
                        const bookingNames = slotBookings.map(b => b.name).join(", ");
                        const labelContent = bookingNames ? `${slot.label} (Booked by ${bookingNames})` : slot.label;
                        const tooltipTitle = bookingNames ? `Booked by ${bookingNames}` : (slotPast ? "Past time" : "");
                        
                        return (
                          <Tooltip key={slot.time} title={tooltipTitle} arrow placement="top">
                            <FormControlLabel
                              control={
                                <Checkbox 
                                  checked={!isSlotBlocked} 
                                  disabled={slotPast}
                                  onChange={(e) => handleSlotToggle(slot.time, e.target.checked)} 
                                />
                              }
                              label={<Typography sx={{ fontSize: "0.85rem", fontWeight: bookingNames ? 700 : 400, color: slotPast ? 'text.disabled' : 'text.primary' }}>{labelContent}</Typography>}
                            />
                          </Tooltip>
                        );
                      })}
                    </Box>
                  </FormGroup>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
}









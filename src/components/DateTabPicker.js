import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { colors, gradientBrand } from '../theme';
import { apiBaseUrl } from '../data/siteData';

function DateTabLabel({ dateStr }) {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.toLocaleDateString('en-IN', { day: '2-digit' });
  const weekday = date.toLocaleDateString('en-IN', { weekday: 'short' });
  const month = date.toLocaleDateString('en-IN', { month: 'short' });
  return (
    <Box sx={{ textAlign: 'center', lineHeight: 1.3, py: 0.5 }}>
      <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>{day}</Typography>
      <Typography sx={{ fontSize: '0.68rem' }}>{weekday}</Typography>
      <Typography sx={{ fontSize: '0.68rem' }}>{month}</Typography>
    </Box>
  );
}

/** "09:00:00" -> 9. Reads the hour regardless of whether seconds are present. */
function hourOf(time) {
  return parseInt(time.split(':')[0], 10);
}

function groupSlots(slots) {
  return {
    morning: slots.filter((s) => hourOf(s.time) < 12),
    afternoon: slots.filter((s) => hourOf(s.time) >= 12 && hourOf(s.time) < 17),
    evening: slots.filter((s) => hourOf(s.time) >= 17),
  };
}

function SlotGroup({ label, slots, selectedTime, onSelect }) {
  if (slots.length === 0) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.textLight, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {slots.map((s) => {
          const selected = selectedTime === s.time;
          return (
            <Button
              key={s.time}
              variant={selected ? 'contained' : 'outlined'}
              disabled={!s.available}
              onClick={() => onSelect(s.time)}
              sx={{
                minWidth: 88, py: 0.9, fontSize: '0.78rem', borderWidth: 2,
                '&:hover': { borderWidth: 2 },
                ...(selected && { background: gradientBrand }),
              }}
            >
              {s.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

/**
 * value: { date: 'YYYY-MM-DD', time: 'HH:mm:ss' } - time is whatever raw
 * string the backend returned, passed straight through (never
 * reformatted), so it round-trips correctly into the booking request.
 * onChange: ({ date, time }) => void
 */
export default function DateTabPicker({ value, onChange, days = 7 }) {
  const [dateList, setDateList] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetch(`${apiBaseUrl}/api/bookings/availability-range?days=${days}`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load availability. Please try again.');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setDateList(data);
        // Preselect whichever tab matches the currently-chosen date, if any.
        const idx = data.findIndex((d) => d.date === value.date);
        setTabIndex(idx >= 0 ? idx : 0);
        if (idx < 0 && data.length > 0) {
          onChange({ date: data[0].date, time: '' });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const handleTabChange = (e, newIndex) => {
    setTabIndex(newIndex);
    // Switching days clears whatever time was picked for the old day.
    onChange({ date: dateList[newIndex]?.date || '', time: '' });
  };

  const handleSlotClick = (time) => {
    onChange({ date: dateList[tabIndex]?.date || '', time });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const currentDay = dateList[tabIndex];
  const groups = currentDay ? groupSlots(currentDay.slots) : { morning: [], afternoon: [], evening: [] };

  return (
    <Box>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{ style: { backgroundColor: colors.primary, height: 3 } }}
        sx={{
          bgcolor: colors.bgLight,
          borderRadius: '10px',
          mb: 2.5,
          minHeight: '64px',
          '& .MuiTab-root': { minWidth: 64, color: colors.textLight, minHeight: '64px' },
          '& .Mui-selected': { color: `${colors.primary} !important` },
        }}
      >
        {dateList.map((d) => (
          <Tab key={d.date} label={<DateTabLabel dateStr={d.date} />} />
        ))}
      </Tabs>

      <SlotGroup label="Morning" slots={groups.morning} selectedTime={value.time} onSelect={handleSlotClick} />
      <SlotGroup label="Afternoon" slots={groups.afternoon} selectedTime={value.time} onSelect={handleSlotClick} />
      <SlotGroup label="Evening" slots={groups.evening} selectedTime={value.time} onSelect={handleSlotClick} />
    </Box>
  );
}

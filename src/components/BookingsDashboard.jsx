import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { getAdminBookings, getUnviewedBookingCount, markBookingAsViewed } from '../utils/bookingsApi.js';

function formatDate(dateValue) {
  if (!dateValue) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${dateValue}T00:00:00`));
}

function formatTime(timeValue) {
  if (!timeValue) return '-';
  const [hourText, minuteText] = String(timeValue).split(':');
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minuteText} ${suffix}`;
}

function formatSlot(booking) {
  if (!booking?.bookingDate || !booking?.slotStartTime) return '-';
  const [hourText, minuteText] = String(booking.slotStartTime).split(':');
  const hour = Number(hourText);
  const endHour = hour + 1;
  const suffix = endHour >= 12 ? 'PM' : 'AM';
  const displayEndHour = endHour % 12 || 12;
  return `${formatDate(booking.bookingDate)} • ${formatTime(booking.slotStartTime)} - ${displayEndHour}:${minuteText} ${suffix}`;
}

function isUpcoming(booking) {
  if (!booking?.bookingDate || !booking?.slotStartTime) return false;
  return new Date(`${booking.bookingDate}T${booking.slotStartTime}`) >= new Date();
}

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
        {value || '-'}
      </Typography>
    </Stack>
  );
}

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [unviewedCount, setUnviewedCount] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [search, setSearch] = useState('');
  const [viewFilter, setViewFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [bookingData, countData] = await Promise.all([
        getAdminBookings(),
        getUnviewedBookingCount()
      ]);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setUnviewedCount(Number(countData) || 0);
    } catch (err) {
      setError(err.message || 'Could not load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      loadDashboard();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [loadDashboard]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch = !term || [
        booking?.name,
        booking?.email,
        booking?.phone,
        booking?.city,
        booking?.goal,
        booking?.dietType
      ].some((value) => String(value || '').toLowerCase().includes(term));

      const matchesFilter =
        viewFilter === 'all' ||
        (viewFilter === 'new' && !booking?.viewed) ||
        (viewFilter === 'upcoming' && isUpcoming(booking));

      return matchesSearch && matchesFilter;
    });
  }, [bookings, search, viewFilter]);

  useEffect(() => {
    setPage(0);
  }, [search, viewFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
    const todayCount = bookings.filter((b) => b?.bookingDate === today).length;
    const upcomingCount = bookings.filter(isUpcoming).length;
    const revenue = bookings.reduce((sum, b) => sum + Number(b?.amountPaidInr || 0), 0);
    return { todayCount, upcomingCount, revenue };
  }, [bookings]);

  const openBooking = async (booking) => {
    setSelectedBooking(booking);
    if (!booking?.viewed) {
      try {
        await markBookingAsViewed(booking.id);
        setBookings((current) => current.map((item) => item.id === booking.id ? { ...item, viewed: true } : item));
        setUnviewedCount((current) => Math.max(0, current - 1));
      } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
          setSelectedBooking(null);
        }
      }
    }
  };

  const joinMeeting = async (booking) => {
    if (!booking?.meetingLink) return;

    if (!booking.viewed) {
      try {
        await markBookingAsViewed(booking.id);
        setBookings((current) => current.map((item) => item.id === booking.id ? { ...item, viewed: true } : item));
        setUnviewedCount((current) => Math.max(0, current - 1));
      } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
          return;
        }
      }
    }

    window.open(booking.meetingLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h4" fontWeight={700}>Consultation Bookings</Typography>
              {unviewedCount > 0 && <Chip color="error" size="small" label={`${unviewedCount} new`} />}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Keep track of paid appointments, client details and upcoming calls.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh bookings">
              <IconButton onClick={loadDashboard} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={unviewedCount ? `${unviewedCount} new booking${unviewedCount === 1 ? '' : 's'}` : 'No new bookings'}>
              <span>
                <IconButton color={unviewedCount ? 'error' : 'default'}>
                  <NotificationsActiveOutlinedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card><CardContent><Typography variant="body2" color="text.secondary">New bookings</Typography><Typography variant="h5" fontWeight={700}>{unviewedCount}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card><CardContent><Typography variant="body2" color="text.secondary">Today's bookings</Typography><Typography variant="h5" fontWeight={700}>{stats.todayCount}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card><CardContent><Typography variant="body2" color="text.secondary">Upcoming</Typography><Typography variant="h5" fontWeight={700}>{stats.upcomingCount}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card><CardContent><Typography variant="body2" color="text.secondary">Paid so far</Typography><Typography variant="h5" fontWeight={700}>₹{stats.revenue.toLocaleString('en-IN')}</Typography></CardContent></Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between">
                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, phone, city..."
                  size="small"
                  sx={{ minWidth: { md: 360 } }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                  }}
                />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button size="small" variant={viewFilter === 'all' ? 'contained' : 'outlined'} onClick={() => setViewFilter('all')}>All</Button>
                  <Button size="small" variant={viewFilter === 'new' ? 'contained' : 'outlined'} color="error" onClick={() => setViewFilter('new')}>New</Button>
                  <Button size="small" variant={viewFilter === 'upcoming' ? 'contained' : 'outlined'} onClick={() => setViewFilter('upcoming')}>Upcoming</Button>
                </Stack>
              </Stack>

              <Divider />

              {loading && bookings.length === 0 ? (
                <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
              ) : filteredBookings.length === 0 ? (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <Typography fontWeight={600}>No bookings found</Typography>
                  <Typography variant="body2" color="text.secondary">Try a different search or filter.</Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small" sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Client</TableCell>
                        <TableCell>Appointment</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Goal</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => (
                        <TableRow key={booking.id} hover sx={{ backgroundColor: booking.viewed ? 'inherit' : 'action.hover' }}>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box>
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                  <Typography variant="body2" fontWeight={700}>{booking.name}</Typography>
                                  {!booking.viewed && <Chip size="small" color="error" label="NEW" sx={{ height: 20, fontSize: 10 }} />}
                                </Stack>
                                <Typography variant="caption" color="text.secondary">{booking.city}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{formatDate(booking.bookingDate)}</Typography>
                            <Typography variant="caption" color="text.secondary">{formatTime(booking.slotStartTime)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{booking.phone}</Typography>
                            <Typography variant="caption" color="text.secondary">{booking.email}</Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 220 }}>
                            <Typography variant="body2" noWrap title={booking.goal}>{booking.goal}</Typography>
                          </TableCell>
                          <TableCell>₹{Number(booking.amountPaidInr || 0).toLocaleString('en-IN')}</TableCell>
                          <TableCell><Chip size="small" label={booking.status || 'CONFIRMED'} color="success" variant="outlined" /></TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                              <Tooltip title="View details">
                                <IconButton size="small" onClick={() => openBooking(booking)}><VisibilityOutlinedIcon fontSize="small" /></IconButton>
                              </Tooltip>
                              <Tooltip title={booking.meetingLink ? 'Join meeting' : 'Meeting link not configured'}>
                                <span>
                                  <IconButton size="small" disabled={!booking.meetingLink} onClick={() => joinMeeting(booking)}><VideoCallIcon fontSize="small" /></IconButton>
                                </span>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={filteredBookings.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, nextPage) => setPage(nextPage)}
                    onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                    rowsPerPageOptions={[10, 25, 50]}
                  />
                </TableContainer>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={Boolean(selectedBooking)} onClose={() => setSelectedBooking(null)} fullWidth maxWidth="sm">
        <DialogTitle>Booking details</DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <Stack divider={<Divider flexItem />}>
              <DetailRow label="Name" value={selectedBooking.name} />
              <DetailRow label="Age / Gender" value={`${selectedBooking.age || '-'} / ${selectedBooking.gender || '-'}`} />
              <DetailRow label="Weight" value={selectedBooking.weightKg != null ? `${selectedBooking.weightKg} kg` : '-'} />
              <DetailRow label="Height" value={selectedBooking.heightCm != null ? `${selectedBooking.heightCm} cm` : '-'} />
              <DetailRow label="Goal" value={selectedBooking.goal} />
              <DetailRow label="Phone" value={selectedBooking.phone} />
              <DetailRow label="Email" value={selectedBooking.email} />
              <DetailRow label="City" value={selectedBooking.city} />
              <DetailRow label="Diet type" value={selectedBooking.dietType} />
              <DetailRow label="Medication" value={selectedBooking.medication} />
              <DetailRow label="Appointment" value={formatSlot(selectedBooking)} />
              <DetailRow label="Amount paid" value={`₹${Number(selectedBooking.amountPaidInr || 0).toLocaleString('en-IN')}`} />
              <DetailRow label="Payment ID" value={selectedBooking.razorpayPaymentId} />
              <DetailRow label="Meeting link" value={selectedBooking.meetingLink} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedBooking(null)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<VideoCallIcon />}
            disabled={!selectedBooking?.meetingLink}
            onClick={() => joinMeeting(selectedBooking)}
          >
            Join meeting
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

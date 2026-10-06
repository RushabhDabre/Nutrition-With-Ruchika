import { useCallback, useEffect, useMemo, useState } from 'react';
import {
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
  MenuItem,
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
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import { getAdminBookings, getBookingPaymentLinks, getUnviewedBookingCount, markBookingAsViewed, markPaymentLinkPaid, updateMeetingStatus } from '../utils/bookingsApi.js';
import { useFeedback } from '../context/FeedbackContext';
import PlanSelectionDialog from './PlanSelectionDialog.jsx';

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

function meetingLabel(status) {
  switch (status) {
    case 'MEETING_PENDING': return 'Meeting Pending';
    case 'MEETING_COMPLETED': return 'Meeting Completed';
    default: return 'Scheduled';
  }
}

function meetingChipProps(status) {
  switch (status) {
    case 'MEETING_PENDING': return { color: 'warning', variant: 'outlined' };
    case 'MEETING_COMPLETED': return { color: 'success', variant: 'outlined' };
    default: return { color: 'default', variant: 'outlined' };
  }
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
  const [selectedPaymentLinks, setSelectedPaymentLinks] = useState([]);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [viewFilter, setViewFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { showSnackbar, showConfirm } = useFeedback();
  const [meetingUpdating, setMeetingUpdating] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingData, countData] = await Promise.all([
        getAdminBookings(),
        getUnviewedBookingCount()
      ]);
      const nextBookings = Array.isArray(bookingData) ? bookingData : [];
      setBookings(nextBookings);
      setUnviewedCount(Number(countData) || 0);
      setSelectedBooking((current) => {
        if (!current) return current;
        return nextBookings.find((item) => item.id === current.id) || current;
      });
    } catch (err) {
      showSnackbar(err.message || 'Could not load bookings.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      loadDashboard();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [loadDashboard]);

  // Auto-poll payment links every 10 seconds if the modal is open and has pending payments
  useEffect(() => {
    let linkTimer;
    if (selectedBooking && selectedPaymentLinks.length > 0) {
      const hasPending = selectedPaymentLinks.some((l) => l.status !== 'PAID' && l.status !== 'CANCELLED' && l.status !== 'EXPIRED');
      if (hasPending) {
        linkTimer = window.setInterval(async () => {
          try {
            const links = await getBookingPaymentLinks(selectedBooking.id);
            setSelectedPaymentLinks(Array.isArray(links) ? links : []);
          } catch (err) {
            // Silently ignore background polling errors
          }
        }, 10000);
      }
    }
    return () => {
      if (linkTimer) window.clearInterval(linkTimer);
    };
  }, [selectedBooking, selectedPaymentLinks]);

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
    setSelectedPaymentLinks([]);

    try {
      const links = await getBookingPaymentLinks(booking.id);
      setSelectedPaymentLinks(Array.isArray(links) ? links : []);
    } catch (err) {
      showSnackbar(err.message || 'Could not load payment links.', 'error');
    }

    if (!booking?.viewed) {
      try {
        await markBookingAsViewed(booking.id);
        setBookings((current) => current.map((item) => item.id === booking.id ? { ...item, viewed: true } : item));
        setSelectedBooking((current) => current?.id === booking.id ? { ...current, viewed: true } : current);
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
        if (err.message === 'UNAUTHORIZED') return;
      }
    }

    window.open(booking.meetingLink, '_blank', 'noopener,noreferrer');
  };

  const handleMeetingStatusChange = async (event, bookingOverride = null) => {
    // React's Select onChange passes (event, childElement)
    const targetBooking = (bookingOverride && bookingOverride.id) ? bookingOverride : selectedBooking;
    if (!targetBooking) return;
    const nextStatus = event.target.value;

    setMeetingUpdating(true);
    try {
      const updated = await updateMeetingStatus(targetBooking.id, nextStatus);
      if (selectedBooking && selectedBooking.id === updated.id) {
        setSelectedBooking(updated);
      }
      setBookings((current) => current.map((item) => item.id === updated.id ? updated : item));
      showSnackbar("Meeting status updated", "success");
    } catch (err) {
      showSnackbar(err.message || 'Could not update meeting status.', 'error');
    } finally {
      setMeetingUpdating(false);
    }
  };

  const handleMarkPaid = async (paymentId) => {
    try {
      await markPaymentLinkPaid(paymentId);
      const links = await getBookingPaymentLinks(selectedBooking.id);
      setSelectedPaymentLinks(Array.isArray(links) ? links : []);
      showSnackbar("Payment marked as PAID manually", "success");
    } catch (err) {
      showSnackbar(err.message || 'Could not mark as paid.', 'error');
    }
  };

  const openPlanDialog = async (bookingOverride = null) => {
    // If called from onClick, bookingOverride is the synthetic event
    const targetBooking = (bookingOverride && bookingOverride.id) ? bookingOverride : selectedBooking;
    if (!targetBooking || targetBooking.meetingStatus !== 'MEETING_COMPLETED') return;

    // Check if there's already a PAID payment link for this booking
    try {
      const links = await getBookingPaymentLinks(targetBooking.id);
      const paidLink = Array.isArray(links) ? links.find((l) => l.status === 'PAID') : null;

      if (paidLink) {
        const proceed = await showConfirm({
          title: 'Payment already received!',
          message: `"${paidLink.planNameSnapshot}" — ₹${Number(paidLink.amountInr || 0).toLocaleString('en-IN')} is already marked as PAID.\n\nDo you still want to create another payment link?`,
          type: 'warning',
          confirmText: 'Create Anyway'
        });
        if (!proceed) return;
      }
    } catch (err) {
      // ignore
    }

    if (bookingOverride && bookingOverride.id) {
      setSelectedBooking(bookingOverride);
    }
    setPlanDialogOpen(true);
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
              Manage paid appointments, consultations and program payment links.
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
                  <Table size="small" sx={{ minWidth: 980 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Client</TableCell>
                        <TableCell>Appointment</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Goal</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Meeting</TableCell>
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
                          <TableCell>
                            <Chip size="small" label={meetingLabel(booking.meetingStatus)} {...meetingChipProps(booking.meetingStatus)} />
                          </TableCell>
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
                              <Tooltip title={booking.meetingStatus === 'MEETING_COMPLETED' ? 'Create program payment link' : 'Complete the meeting first'}>
                                <span>
                                  <IconButton size="small" disabled={booking.meetingStatus !== 'MEETING_COMPLETED'} onClick={() => { setSelectedBooking(booking); setPlanDialogOpen(true); }}>
                                    <PaymentOutlinedIcon fontSize="small" />
                                  </IconButton>
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
            <Stack divider={<Divider flexItem />} spacing={0.5}>
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

              <Box sx={{ py: 1.5 }}>
                {selectedBooking.meetingStatus === 'NOT_STARTED' ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">Meeting status</Typography>
                    <Chip size="small" label="Scheduled" variant="outlined" />
                  </Stack>
                ) : (
                  <>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Meeting status"
                      value={selectedBooking.meetingStatus}
                      onChange={handleMeetingStatusChange}
                      disabled={meetingUpdating || selectedBooking.meetingStatus === 'MEETING_COMPLETED'}
                    >
                      <MenuItem value="MEETING_PENDING">Meeting Pending</MenuItem>
                      <MenuItem value="MEETING_COMPLETED">Meeting Completed</MenuItem>
                    </TextField>
                    {selectedBooking.meetingStatus === 'MEETING_PENDING' && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                        Select “Meeting Completed” after the consultation is finished.
                      </Typography>
                    )}
                  </>
                )}
              </Box>

              <Box sx={{ py: 1.5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PaymentOutlinedIcon />}
                  disabled={selectedBooking.meetingStatus !== 'MEETING_COMPLETED'}
                  onClick={openPlanDialog}
                >
                  Create Payment Link
                </Button>
              </Box>

              {selectedPaymentLinks.length > 0 && (
                <Box sx={{ py: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Program payment links</Typography>
                  <Stack spacing={1}>
                    {selectedPaymentLinks.map((link) => (
                      <Card key={link.id} variant="outlined">
                        <CardContent sx={{ py: 1.25, '&:last-child': { pb: 1.25 } }}>
                          <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                            <Box sx={{ minWidth: 0 }}>
                              <Typography fontWeight={700}>{link.planNameSnapshot}</Typography>
                              <Typography variant="body2">₹{Number(link.amountInr || 0).toLocaleString('en-IN')} • {link.status}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>{link.razorpayShortUrl}</Typography>
                            </Box>
                            {link.razorpayShortUrl && (<Box sx={{ display: 'flex', gap: 1 }}><Button size="small" onClick={() => navigator.clipboard?.writeText(link.razorpayShortUrl)}>Copy</Button>{link.status !== 'PAID' && <Button size="small" color="success" onClick={() => handleMarkPaid(link.id)}>Mark Paid</Button>}</Box>)}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}
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

      <PlanSelectionDialog
        open={planDialogOpen}
        booking={selectedBooking}
        onClose={() => setPlanDialogOpen(false)}
        onSuccess={async () => {
          if (selectedBooking?.id) {
            try {
              const links = await getBookingPaymentLinks(selectedBooking.id);
              setSelectedPaymentLinks(Array.isArray(links) ? links : []);
            } catch {
              // The created-link response is already displayed in the plan dialog.
            }
          }
        }}
      />
    </Box>
  );
}

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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import LaunchIcon from '@mui/icons-material/Launch';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  getAdminBookings,
  getBookingPaymentLinks,
  getUnviewedBookingCount,
  markBookingAsViewed,
  markPaymentLinkPaid,
  updateMeetingStatus,
  updateClientWorkspace,
  getAllPlanPayments,
} from '../utils/bookingsApi.js';
import {
  getBookingDocuments,
  uploadBookingDocument,
  deleteBookingDocument,
  getDocumentViewUrl,
} from '../utils/clientDocumentsApi.js';
import { useFeedback } from '../context/FeedbackContext';
import { colors } from '../theme';
import PlanSelectionDialog from './PlanSelectionDialog.jsx';
import AddClientDialog from './AddClientDialog.jsx';
import PlanRevenueAnalytics from './PlanRevenueAnalytics.jsx';
import { exportClientsToExcel } from '../utils/exportToExcel.js';

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

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getDocumentTypeProps(type) {
  switch (type) {
    case 'DIET_CHART':
      return { label: 'Diet Chart', color: 'success' };
    case 'LAB_REPORT':
      return { label: 'Lab Report', color: 'primary' };
    case 'PRESCRIPTION':
      return { label: 'Prescription', color: 'warning' };
    case 'MEAL_PHOTO':
      return { label: 'Meal Photo', color: 'secondary' };
    default:
      return { label: 'General', color: 'default' };
  }
}

function getFileIcon(fileType) {
  if (!fileType) return <InsertDriveFileOutlinedIcon fontSize="small" sx={{ color: '#64748b' }} />;
  if (fileType.includes('pdf')) return <PictureAsPdfIcon fontSize="small" sx={{ color: '#ef4444' }} />;
  if (fileType.includes('image')) return <ImageOutlinedIcon fontSize="small" sx={{ color: '#3b82f6' }} />;
  return <InsertDriveFileOutlinedIcon fontSize="small" sx={{ color: '#64748b' }} />;
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

export default function BookingsDashboard({ userRole = 'SUPER_ADMIN', permissions = [] }) {
  const isEmployee = userRole === 'EMPLOYEE';
  const canAddClient = !isEmployee || (Array.isArray(permissions) && (permissions.includes('ALL') || permissions.includes('CREATE_CLIENT')));
  const [bookings, setBookings] = useState([]);
  const [planPayments, setPlanPayments] = useState([]);
  const [unviewedCount, setUnviewedCount] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedPaymentLinks, setSelectedPaymentLinks] = useState([]);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [workspaceDriveUrl, setWorkspaceDriveUrl] = useState('');
  const [workspaceNotes, setWorkspaceNotes] = useState('');
  const [workspaceSaving, setWorkspaceSaving] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('DIET_CHART');
  const [docNotes, setDocNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
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
      const promises = [
        getAdminBookings(),
        getUnviewedBookingCount()
      ];
      if (!isEmployee) {
        promises.push(getAllPlanPayments());
      }
      const results = await Promise.all(promises);
      const bookingData = results[0];
      const countData = results[1];
      const paymentsData = !isEmployee ? results[2] : [];

      const nextBookings = Array.isArray(bookingData) ? bookingData : [];
      setBookings(nextBookings);
      setUnviewedCount(Number(countData) || 0);
      if (!isEmployee) {
        setPlanPayments(Array.isArray(paymentsData) ? paymentsData : []);
      }
      setSelectedBooking((current) => {
        if (!current) return current;
        return nextBookings.find((item) => item.id === current.id) || current;
      });
    } catch (err) {
      showSnackbar(err.message || 'Could not load bookings.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar, isEmployee]);

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
    const discoveryRevenue = bookings.reduce((sum, b) => sum + Number(b?.amountPaidInr || 0), 0);
    const planRevenue = (Array.isArray(planPayments) ? planPayments : [])
      .filter((p) => p?.status === 'PAID')
      .reduce((sum, p) => sum + Number(p?.amountInr || 0), 0);
    const revenue = discoveryRevenue + planRevenue;
    return { todayCount, upcomingCount, revenue };
  }, [bookings, planPayments]);

  const handleExportClients = () => {
    try {
      const exportList = filteredBookings.length > 0 ? filteredBookings : bookings;
      exportClientsToExcel(exportList, planPayments);
      showSnackbar(`Exported ${exportList.length} client(s) to Excel!`, 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to export client data.', 'error');
    }
  };

  const openBooking = async (booking) => {
    setSelectedBooking(booking);
    setWorkspaceDriveUrl(booking?.driveFolderUrl || '');
    setWorkspaceNotes(booking?.clinicalNotes || '');
    setSelectedPaymentLinks([]);
    setSelectedFile(null);
    setDocNotes('');
    setDocuments([]);

    setLoadingDocs(true);
    getBookingDocuments(booking.id)
      .then((docs) => setDocuments(Array.isArray(docs) ? docs : []))
      .catch(() => setDocuments([]))
      .finally(() => setLoadingDocs(false));

    if (!isEmployee) {
      try {
        const links = await getBookingPaymentLinks(booking.id);
        setSelectedPaymentLinks(Array.isArray(links) ? links : []);
      } catch (err) {
        showSnackbar(err.message || 'Could not load payment links.', 'error');
      }
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

  const handleUploadDocument = async () => {
    if (!selectedFile || !selectedBooking) {
      showSnackbar('Please select a file to upload.', 'warning');
      return;
    }

    setUploadingDoc(true);
    try {
      const newDoc = await uploadBookingDocument(
        selectedBooking.id,
        selectedFile,
        selectedDocType,
        docNotes
      );
      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedFile(null);
      setDocNotes('');
      const fileInput = document.getElementById('client-vault-file-input');
      if (fileInput) fileInput.value = '';
      showSnackbar('Document uploaded successfully to client vault!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to upload document', 'error');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async (doc) => {
    const confirmed = await showConfirm({
      title: 'Delete Document?',
      message: `Are you sure you want to delete "${doc.fileName}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
    });
    if (!confirmed) return;

    try {
      await deleteBookingDocument(doc.id);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      showSnackbar('Document deleted successfully', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete document', 'error');
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
      loadDashboard();
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

          <Stack direction="row" spacing={1.5} alignItems="center">
            {canAddClient && (
              <Button
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
                onClick={() => setAddClientOpen(true)}
                sx={{
                  backgroundColor: colors.primary,
                  "&:hover": { backgroundColor: colors.primaryDark },
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                }}
              >
                Add Client
              </Button>
            )}
            {!isEmployee && (
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportClients}
                disabled={loading || bookings.length === 0}
                sx={{
                  borderColor: '#10b981',
                  color: '#059669',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    borderColor: '#059669',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)'
                  }
                }}
              >
                Export to Excel
              </Button>
            )}
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
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {isEmployee ? "Assigned clients" : "Total Revenue"}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {isEmployee ? bookings.length : `₹${stats.revenue.toLocaleString('en-IN')}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {!isEmployee && (
          <PlanRevenueAnalytics
            planPayments={planPayments}
            bookings={bookings}
            onExportClients={handleExportClients}
          />
        )}

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
                        {!isEmployee && <TableCell>Payment</TableCell>}
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
                                  {booking.whatsappReminderSent && (
                                    <Tooltip title="WhatsApp Reminder Sent" arrow>
                                      <WhatsAppIcon sx={{ fontSize: 16, color: '#25D366' }} />
                                    </Tooltip>
                                  )}
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
                          {!isEmployee && (
                            <TableCell>₹{Number(booking.amountPaidInr || 0).toLocaleString('en-IN')}</TableCell>
                          )}
                          <TableCell>
                            <Chip size="small" label={meetingLabel(booking.meetingStatus)} {...meetingChipProps(booking.meetingStatus)} />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                              <Tooltip title="View details">
                                <IconButton size="small" onClick={() => openBooking(booking)}><VisibilityOutlinedIcon fontSize="small" /></IconButton>
                              </Tooltip>
                              {booking.driveFolderUrl && (
                                <Tooltip title="Open Client Google Drive Folder">
                                  <IconButton
                                    size="small"
                                    component="a"
                                    href={booking.driveFolderUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={{ color: '#4f46e5' }}
                                  >
                                    <FolderSharedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {!isEmployee && booking.meetingStatus !== 'MEETING_COMPLETED' && Boolean(booking.meetingLink) && (
                                <Tooltip title="Join meeting">
                                  <span>
                                    <IconButton size="small" color="primary" onClick={() => joinMeeting(booking)}>
                                      <VideoCallIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              )}
                              {!isEmployee && (
                                <Tooltip title={booking.meetingStatus === 'MEETING_COMPLETED' ? 'Create program payment link' : 'Complete the meeting first'}>
                                  <span>
                                    <IconButton size="small" disabled={booking.meetingStatus !== 'MEETING_COMPLETED'} onClick={() => { setSelectedBooking(booking); setPlanDialogOpen(true); }}>
                                      <PaymentOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              )}
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

      <Dialog open={Boolean(selectedBooking)} onClose={() => setSelectedBooking(null)} fullWidth maxWidth="md">
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
              {!isEmployee && (
                <>
                  <DetailRow label="Amount paid" value={`₹${Number(selectedBooking.amountPaidInr || 0).toLocaleString('en-IN')}`} />
                  <DetailRow label="Payment ID" value={selectedBooking.razorpayPaymentId} />
                </>
              )}
              {!isEmployee && selectedBooking.meetingStatus !== 'MEETING_COMPLETED' && selectedBooking.meetingLink && (
                <DetailRow label="Meeting link" value={selectedBooking.meetingLink} />
              )}

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

              {/* Client Workspace & Document Vault */}
              <Box sx={{ py: 2, bgcolor: '#f8fafc', p: 2.5, borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FolderSharedIcon sx={{ fontSize: 20, color: '#4f46e5' }} />
                    <Typography variant="subtitle2" fontWeight={700}>
                      Client Vault & Documents
                    </Typography>
                    <Chip
                      size="small"
                      label={`${documents.length} Files`}
                      color="primary"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.72rem', fontWeight: 600 }}
                    />
                  </Stack>
                  {selectedBooking.driveFolderUrl && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<LaunchIcon />}
                      href={selectedBooking.driveFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Drive
                    </Button>
                  )}
                </Stack>

                {/* Direct File Uploader Box */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: '#ffffff',
                    borderRadius: 2,
                    borderStyle: 'dashed',
                    borderColor: '#cbd5e1'
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Upload New Client Document
                  </Typography>

                  <Stack spacing={1.5}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
                      <TextField
                        select
                        size="small"
                        label="Document Type"
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        sx={{ minWidth: 160, width: { xs: '100%', sm: 180 } }}
                      >
                        <MenuItem value="DIET_CHART">🥗 Diet Chart</MenuItem>
                        <MenuItem value="LAB_REPORT">🩸 Lab / Blood Report</MenuItem>
                        <MenuItem value="PRESCRIPTION">💊 Prescription</MenuItem>
                        <MenuItem value="MEAL_PHOTO">📸 Meal Photo</MenuItem>
                        <MenuItem value="OTHER">📄 Other Document</MenuItem>
                      </TextField>

                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        startIcon={<CloudUploadIcon />}
                        sx={{ textTransform: 'none', fontWeight: 600, flexShrink: 0, height: 40 }}
                      >
                        {selectedFile ? 'Change File' : 'Choose File'}
                        <input
                          id="client-vault-file-input"
                          type="file"
                          hidden
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0]);
                            }
                          }}
                        />
                      </Button>

                      {selectedFile && (
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                          {selectedFile.name} ({formatBytes(selectedFile.size)})
                        </Typography>
                      )}
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
                      <TextField
                        fullWidth
                        size="small"
                        label="Note (Optional)"
                        placeholder="e.g. Week 1 High Protein Diet Plan"
                        value={docNotes}
                        onChange={(e) => setDocNotes(e.target.value)}
                      />

                      <Button
                        variant="contained"
                        size="small"
                        disabled={!selectedFile || uploadingDoc}
                        onClick={handleUploadDocument}
                        sx={{ textTransform: 'none', fontWeight: 700, px: 2.5, height: 40, flexShrink: 0 }}
                      >
                        {uploadingDoc ? <CircularProgress size={20} color="inherit" /> : 'Upload to Vault'}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>

                {/* Uploaded Documents List */}
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Uploaded Documents
                </Typography>

                {loadingDocs ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : documents.length === 0 ? (
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: '#ffffff', mb: 2, borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      No documents uploaded yet. Upload a diet chart or blood test report above.
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={1} sx={{ mb: 2.5 }}>
                    {documents.map((doc) => {
                      const typeProps = getDocumentTypeProps(doc.documentType);
                      return (
                        <Paper
                          key={doc.id}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            bgcolor: '#ffffff',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flexGrow: 1 }}>
                            {getFileIcon(doc.fileType)}
                            <Box sx={{ minWidth: 0 }}>
                              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: { xs: 140, sm: 260 } }}>
                                  {doc.fileName}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={typeProps.label}
                                  color={typeProps.color}
                                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                                />
                              </Stack>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {formatBytes(doc.fileSizeBytes)} • {formatDate(doc.createdAt ? doc.createdAt.substring(0, 10) : '')}
                                {doc.notes && ` • "${doc.notes}"`}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={0.5} flexShrink={0}>
                            <Tooltip title="View / Download Document">
                              <IconButton
                                size="small"
                                component="a"
                                href={getDocumentViewUrl(doc)}
                                target="_blank"
                                rel="noreferrer"
                                sx={{ color: '#4f46e5' }}
                              >
                                <LaunchIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Document">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteDocument(doc)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                )}

                {/* Clinical Notes & Legacy External Drive Link */}
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Clinical Notes & External Drive (Optional)
                </Typography>

                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={3}
                    label="Clinical & Consultation Notes"
                    placeholder="Health history, food allergies, dietary restrictions, follow-up progress..."
                    value={workspaceNotes}
                    onChange={(e) => setWorkspaceNotes(e.target.value)}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="External Google Drive Folder URL (Optional)"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={workspaceDriveUrl}
                    onChange={(e) => setWorkspaceDriveUrl(e.target.value)}
                    helperText="Optional external link for existing folders"
                  />

                  <Box sx={{ textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={workspaceSaving}
                      onClick={async () => {
                        try {
                          setWorkspaceSaving(true);
                          const updated = await updateClientWorkspace(selectedBooking.id, {
                            driveFolderUrl: workspaceDriveUrl,
                            clinicalNotes: workspaceNotes,
                          });
                          setSelectedBooking(updated);
                          setBookings((prev) =>
                            prev.map((b) => (b.id === updated.id ? updated : b))
                          );
                          showSnackbar('Client workspace saved successfully!', 'success');
                        } catch (err) {
                          showSnackbar(err.message || 'Failed to save workspace', 'error');
                        } finally {
                          setWorkspaceSaving(false);
                        }
                      }}
                    >
                      {workspaceSaving ? 'Saving...' : 'Save Workspace Notes'}
                    </Button>
                  </Box>
                </Stack>
              </Box>

              {!isEmployee && (
                <>
                  <Box sx={{ py: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PaymentOutlinedIcon />}
                      disabled={selectedBooking.meetingStatus !== 'MEETING_COMPLETED'}
                      onClick={openPlanDialog}
                    >
                      Assign Plan / Payment
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
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {selectedBooking?.meetingStatus === 'MEETING_COMPLETED' && (
              <Chip
                size="small"
                color="success"
                variant="outlined"
                label="Consultation Completed"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button onClick={() => setSelectedBooking(null)}>Close</Button>
            {!isEmployee &&
              selectedBooking?.meetingStatus !== 'MEETING_COMPLETED' &&
              Boolean(selectedBooking?.meetingLink) && (
                <Button
                  variant="contained"
                  startIcon={<VideoCallIcon />}
                  onClick={() => joinMeeting(selectedBooking)}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  Join meeting
                </Button>
              )}
          </Stack>
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
              loadDashboard();
            } catch {
              // The created-link response is already displayed in the plan dialog.
            }
          }
        }}
      />

      <AddClientDialog
        open={addClientOpen}
        onClose={() => setAddClientOpen(false)}
        onSuccess={async (newClient) => {
          await loadDashboard();
          if (newClient) {
            setSelectedBooking(newClient);
          }
        }}
      />
    </Box>
  );
}

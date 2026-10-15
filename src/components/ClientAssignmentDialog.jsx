import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { getBookings } from "../utils/bookingsApi.js";
import {
  getEmployeeAssignedClients,
  assignClientsToEmployee,
} from "../utils/employeeApi.js";
import { useFeedback } from "../context/FeedbackContext";
import { colors, gradientBrand } from "../theme";

export default function ClientAssignmentDialog({
  open,
  employee,
  onClose,
  onSaveSuccess,
}) {
  const [allBookings, setAllBookings] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { showSnackbar } = useFeedback();

  const loadData = useCallback(async () => {
    if (!employee?.id) return;
    setLoading(true);
    try {
      const [bookings, assignedIds] = await Promise.all([
        getBookings(),
        getEmployeeAssignedClients(employee.id),
      ]);
      setAllBookings(Array.isArray(bookings) ? bookings : []);
      setSelectedIds(new Set(Array.isArray(assignedIds) ? assignedIds : []));
    } catch (err) {
      showSnackbar(err.message || "Failed to load client data.", "error");
    } finally {
      setLoading(false);
    }
  }, [employee?.id, showSnackbar]);

  useEffect(() => {
    if (open) {
      loadData();
      setSearch("");
      setPage(0);
    }
  }, [open, loadData]);

  const filteredBookings = useMemo(() => {
    if (!search.trim()) return allBookings;
    const q = search.toLowerCase();
    return allBookings.filter(
      (b) =>
        (b.name && b.name.toLowerCase().includes(q)) ||
        (b.phone && b.phone.includes(q)) ||
        (b.email && b.email.toLowerCase().includes(q)) ||
        (b.city && b.city.toLowerCase().includes(q)) ||
        (b.goal && b.goal.toLowerCase().includes(q))
    );
  }, [allBookings, search]);

  const handleToggle = (bookingId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookingId)) {
        next.delete(bookingId);
      } else {
        next.add(bookingId);
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredBookings.forEach((b) => next.add(b.id));
      return next;
    });
  };

  const handleDeselectAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredBookings.forEach((b) => next.delete(b.id));
      return next;
    });
  };

  const handleSave = async () => {
    if (!employee?.id) return;
    setSaving(true);
    try {
      await assignClientsToEmployee(employee.id, Array.from(selectedIds));
      showSnackbar(
        `Successfully updated assigned clients for ${employee.displayName}.`,
        "success"
      );
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err) {
      showSnackbar(err.message || "Failed to save client assignments.", "error");
    } finally {
      setSaving(false);
    }
  };

  const allFilteredSelected =
    filteredBookings.length > 0 &&
    filteredBookings.every((b) => selectedIds.has(b.id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: gradientBrand,
          color: colors.white,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Assign Clients to {employee?.displayName || "Employee"}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            @{employee?.username} • {selectedIds.size} client(s) currently selected
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: colors.white }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Select which clients this employee is allowed to view. The employee will
            only see intake details, consultation status, and documents for their assigned
            clients (payment history is strictly hidden).
          </Typography>

          {/* Search & Bulk Selection Toolbar */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              size="small"
              placeholder="Search clients by name, phone, city, goal..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: colors.textLight }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                size="small"
                variant="outlined"
                onClick={
                  allFilteredSelected
                    ? handleDeselectAllFiltered
                    : handleSelectAllFiltered
                }
                startIcon={
                  allFilteredSelected ? (
                    <CheckBoxOutlineBlankIcon fontSize="small" />
                  ) : (
                    <CheckBoxIcon fontSize="small" />
                  )
                }
              >
                {allFilteredSelected ? "Deselect Filtered" : "Select Filtered"}
              </Button>
              <Chip
                label={`${selectedIds.size} Selected`}
                color="primary"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Stack>

          {/* Client Table */}
          {loading ? (
            <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={36} />
            </Box>
          ) : filteredBookings.length === 0 ? (
            <Paper variant="outlined" sx={{ py: 6, textAlign: "center" }}>
              <Typography fontWeight={600}>No clients found</Typography>
              <Typography variant="body2" color="text.secondary">
                {search ? "Try adjusting your search query." : "No confirmed client bookings exist yet."}
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={allFilteredSelected}
                        indeterminate={
                          !allFilteredSelected &&
                          filteredBookings.some((b) => selectedIds.has(b.id))
                        }
                        onChange={() => {
                          if (allFilteredSelected) {
                            handleDeselectAllFiltered();
                          } else {
                            handleSelectAllFiltered();
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Client Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Appointment</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>City</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Goal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((booking) => {
                      const isSelected = selectedIds.has(booking.id);
                      return (
                        <TableRow
                          key={booking.id}
                          hover
                          onClick={() => handleToggle(booking.id)}
                          sx={{
                            cursor: "pointer",
                            bgcolor: isSelected ? "rgba(99, 102, 241, 0.04)" : "inherit",
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox size="small" checked={isSelected} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {booking.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {booking.bookingDate || "-"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.slotStartTime || ""}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{booking.phone || "-"}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.email || ""}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{booking.city || "-"}</Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 200 }}>
                            <Tooltip title={booking.goal || ""} arrow>
                              <Typography variant="body2" noWrap>
                                {booking.goal || "-"}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredBookings.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, p) => setPage(p)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </TableContainer>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={saving} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || loading}
          sx={{
            background: gradientBrand,
            px: 3,
            fontWeight: 700,
          }}
        >
          {saving ? "Saving..." : `Save Assignments (${selectedIds.size})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

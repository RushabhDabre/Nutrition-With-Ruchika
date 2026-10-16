import React, { useState, useEffect, useCallback } from "react";
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
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Checkbox,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  resetEmployeePassword,
  deleteEmployee,
} from "../utils/employeeApi";
import ClientAssignmentDialog from "./ClientAssignmentDialog";
import { useFeedback } from "../context/FeedbackContext";
import { colors, gradientBrand } from "../theme";

const AVAILABLE_PERMISSIONS = [
  {
    key: "VIEW_BOOKINGS",
    label: "View & Manage Bookings",
    description: "Access assigned clients, appointment statuses, and notes (payment data hidden)",
  },
  {
    key: "VIEW_DOCUMENTS",
    label: "Client Documents",
    description: "View and upload diet charts, lab reports, and files for assigned clients",
  },
  {
    key: "MANAGE_CMS",
    label: "Site Content & CMS",
    description: "Edit hero headline, bio, contact information, and consultation settings",
  },
  {
    key: "MANAGE_TESTIMONIALS",
    label: "Testimonials",
    description: "Add, edit, and organize client review stories and transformation media",
  },
  {
    key: "MANAGE_BANNERS",
    label: "Ads & Promotional Banners",
    description: "Create and schedule top announcement strips and popup modals",
  },
  {
    key: "MANAGE_HELP_AREAS",
    label: "What I Help With",
    description: "Update health conditions and specialization cards on the homepage",
  },
  {
    key: "MANAGE_WHY_CHOOSE_ME",
    label: "Why Choose Me",
    description: "Manage USP cards and value propositions",
  },
  {
    key: "MANAGE_SERVICES",
    label: "Services",
    description: "Manage clinical specialty and package listings",
  },
  {
    key: "MANAGE_FAQ",
    label: "FAQ",
    description: "Update questions and answers in the accordion section",
  },
  {
    key: "MANAGE_AVAILABILITY",
    label: "Availability & Schedule",
    description: "Manage working days, holiday overrides, and slot blocks",
  },
];

export default function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null); // null if creating
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordEmployee, setPasswordEmployee] = useState(null);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [clientEmployee, setClientEmployee] = useState(null);

  // Form states
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formPermissions, setFormPermissions] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { showSnackbar, showConfirm } = useFeedback();

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      showSnackbar(err.message || "Failed to load employees.", "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setFormUsername("");
    setFormPassword("");
    setFormDisplayName("");
    setFormEmail("");
    setFormPhone("");
    setFormActive(true);
    setFormPermissions(["VIEW_BOOKINGS", "VIEW_DOCUMENTS"]);
    setEditDialogOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setFormUsername(emp.username);
    setFormPassword("");
    setFormDisplayName(emp.displayName || "");
    setFormEmail(emp.email || "");
    setFormPhone(emp.phone || "");
    setFormActive(emp.active);
    setFormPermissions(Array.isArray(emp.permissions) ? emp.permissions : []);
    setEditDialogOpen(true);
  };

  const handleTogglePermission = (permKey) => {
    setFormPermissions((prev) =>
      prev.includes(permKey)
        ? prev.filter((k) => k !== permKey)
        : [...prev, permKey]
    );
  };

  const handleSaveEmployee = async () => {
    if (!formDisplayName.trim()) {
      showSnackbar("Display Name is required.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          displayName: formDisplayName.trim(),
          email: formEmail.trim() || null,
          phone: formPhone.trim() || null,
          active: formActive,
          permissions: formPermissions,
        });
        showSnackbar(`Updated employee ${formDisplayName}.`, "success");
      } else {
        if (!formUsername.trim() || formUsername.trim().length < 3) {
          showSnackbar("Username must be at least 3 characters.", "warning");
          setSubmitting(false);
          return;
        }
        if (!formPassword.trim() || formPassword.trim().length < 6) {
          showSnackbar("Password must be at least 6 characters.", "warning");
          setSubmitting(false);
          return;
        }
        await createEmployee({
          username: formUsername.trim().toLowerCase(),
          password: formPassword.trim(),
          displayName: formDisplayName.trim(),
          email: formEmail.trim() || null,
          phone: formPhone.trim() || null,
          permissions: formPermissions,
        });
        showSnackbar(`Created employee login for ${formDisplayName}.`, "success");
      }
      setEditDialogOpen(false);
      loadEmployees();
    } catch (err) {
      showSnackbar(err.message || "Failed to save employee.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPasswordReset = (emp) => {
    setPasswordEmployee(emp);
    setNewPassword("");
    setPasswordDialogOpen(true);
  };

  const handleSavePassword = async () => {
    if (!newPassword.trim() || newPassword.trim().length < 6) {
      showSnackbar("Password must be at least 6 characters.", "warning");
      return;
    }
    setSubmitting(true);
    try {
      await resetEmployeePassword(passwordEmployee.id, newPassword.trim());
      showSnackbar(
        `Password updated for ${passwordEmployee.displayName}.`,
        "success"
      );
      setPasswordDialogOpen(false);
    } catch (err) {
      showSnackbar(err.message || "Failed to reset password.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (emp) => {
    const confirmed = await showConfirm({
      title: `Delete Employee "${emp.displayName}"?`,
      message: `Are you sure you want to delete @${emp.username}? They will immediately lose access to all client data and dashboard tools.`,
      confirmText: "Delete Employee",
      type: "error",
    });
    if (!confirmed) return;

    try {
      await deleteEmployee(emp.id);
      showSnackbar(`Deleted employee ${emp.displayName}.`, "success");
      loadEmployees();
    } catch (err) {
      showSnackbar(err.message || "Failed to delete employee.", "error");
    }
  };

  const handleOpenAssignClients = (emp) => {
    setClientEmployee(emp);
    setClientDialogOpen(true);
  };

  return (
    <Stack spacing={3}>
      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${colors.border}`,
          bgcolor: colors.white,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <GroupIcon sx={{ fontSize: 32, color: colors.primary }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Employee Management
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create staff logins, grant customizable permissions, and assign clients.
            Employees can access client notes and documents, while payment and revenue history remain strictly private.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenCreate}
          sx={{
            background: gradientBrand,
            fontWeight: 700,
            px: 3,
            py: 1,
            whiteSpace: "nowrap",
          }}
        >
          Add Employee
        </Button>
      </Paper>

      {/* Employees Grid */}
      {loading ? (
        <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : employees.length === 0 ? (
        <Paper variant="outlined" sx={{ py: 8, textAlign: "center", borderRadius: 3 }}>
          <Typography fontWeight={700}>No employees created yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Click "Add Employee" above to create your first team login.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {employees.map((emp) => {
            const isSuperAdmin = emp.role === "SUPER_ADMIN";
            return (
              <Grid item xs={12} md={6} key={emp.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    borderColor: isSuperAdmin ? "rgba(99, 102, 241, 0.4)" : colors.border,
                    bgcolor: isSuperAdmin ? "rgba(99, 102, 241, 0.02)" : colors.white,
                    boxShadow: isSuperAdmin ? "0 4px 20px rgba(99, 102, 241, 0.08)" : "none",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Stack spacing={2}>
                      {/* Top Bar: Name, Role, Status */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {emp.displayName}
                            </Typography>
                            {isSuperAdmin ? (
                              <Chip
                                icon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />}
                                label="Super Admin"
                                size="small"
                                sx={{
                                  bgcolor: "#e0e7ff",
                                  color: "#4338ca",
                                  fontWeight: 700,
                                }}
                              />
                            ) : (
                              <Chip
                                icon={<BadgeIcon sx={{ fontSize: 16 }} />}
                                label="Staff Employee"
                                size="small"
                                sx={{
                                  bgcolor: "#ecfdf5",
                                  color: "#047857",
                                  fontWeight: 700,
                                }}
                              />
                            )}
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            @{emp.username}
                          </Typography>
                        </Box>

                        <Chip
                          icon={
                            emp.active ? (
                              <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <HighlightOffIcon sx={{ fontSize: 14 }} />
                            )
                          }
                          label={emp.active ? "Active" : "Disabled"}
                          size="small"
                          color={emp.active ? "success" : "default"}
                          variant="outlined"
                        />
                      </Stack>

                      {/* Contact Info */}
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Email:</strong> {emp.email || "—"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Phone:</strong> {emp.phone || "—"}
                        </Typography>
                      </Stack>

                      {/* Client Assignment Badge */}
                      {!isSuperAdmin && (
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "#f8fafc",
                            border: "1px dashed #cbd5e1",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              👥 {emp.assignedClientCount} Assigned Clients
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Can only view consultation notes and files for these clients
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenAssignClients(emp)}
                            sx={{ fontWeight: 700, textTransform: "none" }}
                          >
                            Assign Clients
                          </Button>
                        </Box>
                      )}

                      {/* Permissions List */}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, color: colors.textLight, textTransform: "uppercase" }}
                        >
                          Granted Permissions
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.75 }}>
                          {isSuperAdmin ? (
                            <Chip
                              label="★ Full System Access"
                              size="small"
                              sx={{ bgcolor: "#f3e8ff", color: "#7e22ce", fontWeight: 700 }}
                            />
                          ) : !emp.permissions || emp.permissions.length === 0 ? (
                            <Typography variant="caption" color="text.secondary">
                              No permissions granted yet.
                            </Typography>
                          ) : (
                            emp.permissions.map((p) => {
                              const found = AVAILABLE_PERMISSIONS.find((ap) => ap.key === p);
                              return (
                                <Chip
                                  key={p}
                                  label={found ? found.label : p}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: 11 }}
                                />
                              );
                            })
                          )}
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>

                  <Divider />

                  {/* Card Bottom Actions */}
                  <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Tooltip title="Reset Password">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenPasswordReset(emp)}
                        sx={{ color: "#64748b" }}
                      >
                        <VpnKeyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit Employee">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(emp)}
                        sx={{ color: colors.primary }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {!isSuperAdmin && (
                      <Tooltip title="Delete Employee">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteEmployee(emp)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add / Edit Employee Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !submitting && setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: gradientBrand,
            color: colors.white,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {editingEmployee ? `Edit ${editingEmployee.displayName}` : "Create Employee Login"}
          </Typography>
          <IconButton
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: colors.white }}
            disabled={submitting}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {editingEmployee
                ? "Update display name, contact details, active status, and feature permissions."
                : "Create credentials for an employee. They can sign in at /admin using this username and password."}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Username"
                  fullWidth
                  size="small"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  disabled={Boolean(editingEmployee)}
                  helperText={
                    editingEmployee
                      ? "Username cannot be changed."
                      : "Unique login identifier (e.g. sneha)"
                  }
                  required
                />
              </Grid>

              {!editingEmployee && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Temporary Password"
                    type="password"
                    fullWidth
                    size="small"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    helperText="At least 6 characters"
                    required
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={editingEmployee ? 12 : 12}>
                <TextField
                  label="Display Name"
                  fullWidth
                  size="small"
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                  placeholder="e.g. Dr. Sneha Patil"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email (Optional)"
                  fullWidth
                  size="small"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  type="email"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone (Optional)"
                  fullWidth
                  size="small"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                />
              </Grid>
            </Grid>

            {editingEmployee && editingEmployee.role !== "SUPER_ADMIN" && (
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Account Active (Toggle to disable login)
                    </Typography>
                  }
                />
              </Box>
            )}

            {/* Permissions Checkbox Group */}
            {(!editingEmployee || editingEmployee.role !== "SUPER_ADMIN") && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                  Feature Permissions:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 260, overflowY: "auto", borderRadius: 2 }}>
                  <FormGroup>
                    {AVAILABLE_PERMISSIONS.map((perm) => (
                      <FormControlLabel
                        key={perm.key}
                        control={
                          <Checkbox
                            size="small"
                            checked={formPermissions.includes(perm.key)}
                            onChange={() => handleTogglePermission(perm.key)}
                          />
                        }
                        label={
                          <Box sx={{ py: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {perm.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {perm.description}
                            </Typography>
                          </Box>
                        }
                      />
                    ))}
                  </FormGroup>
                </Paper>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setEditDialogOpen(false)} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveEmployee}
            variant="contained"
            disabled={submitting}
            sx={{ background: gradientBrand, px: 3, fontWeight: 700 }}
          >
            {submitting ? "Saving..." : editingEmployee ? "Update Employee" : "Create Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => !submitting && setPasswordDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Reset Password for {passwordEmployee?.displayName}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a new password for @{passwordEmployee?.username}. Share this password directly with the employee.
          </Typography>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            size="small"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Minimum 6 characters"
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPasswordDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSavePassword}
            variant="contained"
            disabled={submitting}
            sx={{ background: gradientBrand, fontWeight: 700 }}
          >
            {submitting ? "Resetting..." : "Set New Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Client Assignment Dialog */}
      {clientEmployee && (
        <ClientAssignmentDialog
          open={clientDialogOpen}
          employee={clientEmployee}
          onClose={() => setClientDialogOpen(false)}
          onSaveSuccess={loadEmployees}
        />
      )}
    </Stack>
  );
}

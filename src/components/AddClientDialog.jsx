import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { colors } from "../theme";
import { createManualClient } from "../utils/bookingsApi";
import { useFeedback } from "../context/FeedbackContext";

const HEALTH_GOALS = [
  "Weight Loss",
  "Weight Gain & Muscle Building",
  "PCOD / PCOS Management",
  "Thyroid Care",
  "Diabetes & Blood Sugar Control",
  "Postpartum & Pregnancy Nutrition",
  "Gut Health & Acidity",
  "High Cholesterol & Heart Health",
  "General Health & Balanced Living",
  "Other",
];

const DIET_TYPES = [
  "Vegetarian",
  "Non-Vegetarian",
  "Eggetarian",
  "Vegan",
  "Jain",
];

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  age: "28",
  gender: "FEMALE",
  weightKg: "",
  heightCm: "",
  city: "",
  goal: "Weight Loss",
  customGoal: "",
  dietType: "Vegetarian",
  medication: "",
  clinicalNotes: "",
  driveFolderUrl: "",
  markMeetingCompleted: true,
};

export default function AddClientDialog({ open, onClose, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const { showSnackbar } = useFeedback();

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!form.name.trim()) {
      showSnackbar("Client name is required", "error");
      return;
    }
    if (!form.phone.trim()) {
      showSnackbar("Phone / WhatsApp number is required", "error");
      return;
    }

    setSaving(true);
    try {
      const finalGoal = form.goal === "Other" && form.customGoal.trim()
        ? form.customGoal.trim()
        : form.goal;

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        city: form.city.trim() || undefined,
        goal: finalGoal,
        dietType: form.dietType,
        medication: form.medication.trim() || undefined,
        clinicalNotes: form.clinicalNotes.trim() || undefined,
        driveFolderUrl: form.driveFolderUrl.trim() || undefined,
        markMeetingCompleted: form.markMeetingCompleted,
      };

      const created = await createManualClient(payload);
      showSnackbar(`Client "${created.name}" added successfully!`, "success");
      setForm(INITIAL_FORM);
      onClose();
      onSuccess?.(created);
    } catch (err) {
      showSnackbar(err.message || "Failed to add client.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !saving && onClose()} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonAddAlt1Icon sx={{ color: colors.primary }} />
          <Typography variant="h6" fontWeight={700}>
            Add New Client
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manually enroll a direct client (referral, WhatsApp inquiry, in-person, or walk-in).
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Section: Basic Details */}
          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>
            1. Basic Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                required
                fullWidth
                value={form.name}
                onChange={handleChange("name")}
                placeholder="e.g. Priya Sharma"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone / WhatsApp Number"
                required
                fullWidth
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="e.g. 9876543210"
                helperText="Will be used for WhatsApp updates and receipts"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={form.email}
                onChange={handleChange("email")}
                placeholder="e.g. priya@gmail.com (Optional)"
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Age"
                type="number"
                fullWidth
                value={form.age}
                onChange={handleChange("age")}
                inputProps={{ min: 1, max: 120 }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={form.gender}
                  label="Gender"
                  onChange={handleChange("gender")}
                >
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Section: Health & Physical Details */}
          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>
            2. Health & Lifestyle Profile
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City / Location"
                fullWidth
                value={form.city}
                onChange={handleChange("city")}
                placeholder="e.g. Mumbai, Pune"
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Weight (kg)"
                type="number"
                fullWidth
                value={form.weightKg}
                onChange={handleChange("weightKg")}
                placeholder="e.g. 64"
                inputProps={{ step: "0.1", min: 1 }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Height (cm)"
                type="number"
                fullWidth
                value={form.heightCm}
                onChange={handleChange("heightCm")}
                placeholder="e.g. 162"
                inputProps={{ step: "0.5", min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Primary Goal</InputLabel>
                <Select
                  value={form.goal}
                  label="Primary Goal"
                  onChange={handleChange("goal")}
                >
                  {HEALTH_GOALS.map((goal) => (
                    <MenuItem key={goal} value={goal}>
                      {goal}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {form.goal === "Other" && (
                <TextField
                  label="Specify Goal"
                  fullWidth
                  sx={{ mt: 1.5 }}
                  value={form.customGoal}
                  onChange={handleChange("customGoal")}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Diet Preference</InputLabel>
                <Select
                  value={form.dietType}
                  label="Diet Preference"
                  onChange={handleChange("dietType")}
                >
                  {DIET_TYPES.map((dt) => (
                    <MenuItem key={dt} value={dt}>
                      {dt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Medical History / Conditions / Medications"
                fullWidth
                multiline
                minRows={2}
                value={form.medication}
                onChange={handleChange("medication")}
                placeholder="e.g. Hypothyroidism (Thyronorm 50mcg), Vitamin D deficiency"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Section: Clinical Workspace & Readiness */}
          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>
            3. Consultation Status & Workspace
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.markMeetingCompleted}
                    onChange={handleChange("markMeetingCompleted")}
                    color="success"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Initial Consultation Already Done / Completed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Enables immediate plan assignment, offline payment recording, and diet chart uploads.
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Initial Clinical / Assessment Notes"
                fullWidth
                multiline
                minRows={3}
                value={form.clinicalNotes}
                onChange={handleChange("clinicalNotes")}
                placeholder="Observations, target calorie deficit, food preferences, initial advice..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Google Drive Folder URL (Optional)"
                fullWidth
                value={form.driveFolderUrl}
                onChange={handleChange("driveFolderUrl")}
                placeholder="https://drive.google.com/drive/folders/..."
                helperText="Link to the client's Google Drive folder if you keep one."
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button disabled={saving} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={saving || !form.name.trim() || !form.phone.trim()}
          onClick={handleSubmit}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <PersonAddAlt1Icon />}
          sx={{
            backgroundColor: colors.primary,
            "&:hover": { backgroundColor: colors.primaryDark },
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {saving ? "Adding Client..." : "Save & Add Client"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

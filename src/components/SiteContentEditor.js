import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { colors, gradientBrand } from "../theme";
import { apiBaseUrl } from "../data/siteData";
import { adminFetch } from "../utils/adminAuth";
import { uploadMediaFile } from "../supabaseClient";

const FIELD_SX = { mb: 2 };

function PhotoUploadRow({ label, photoUrl, uploading, onUpload }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
      <Avatar
        src={photoUrl || undefined}
        sx={{
          width: 64,
          height: 64,
          bgcolor: colors.bgLight,
          fontSize: "1.8rem",
        }}
      >
        {!photoUrl && "👩‍⚕️"}
      </Avatar>
      <Box>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, mb: 0.5 }}>
          {label}
        </Typography>
        <Button
          component="label"
          size="small"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
        >
          {uploading
            ? "Uploading..."
            : photoUrl
              ? "Replace Photo"
              : "Upload Photo"}
          <input type="file" hidden accept="image/*" onChange={onUpload} />
        </Button>
      </Box>
    </Box>
  );
}

export default function SiteContentEditor() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/site-settings`)
      .then((res) => res.json())
      .then(setContent)
      .catch(() => setError("Could not load current content."))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setSaved(false);
  };

  const updateTopLevel = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handlePhotoUpload = async (section, setUploading, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadMediaFile(file, section);
      updateField(section, "photoUrl", url);
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await adminFetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Save failed. Please try again.");
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  if (!content)
    return <Alert severity="error">{error || "No content loaded."}</Alert>;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Saved! Changes are now live on the site.
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `2px solid ${colors.border}`,
          borderRadius: "14px",
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 2 }}>Contact Info</Typography>
        <TextField
          label="WhatsApp Number (e.g. 919876543210)"
          fullWidth
          sx={FIELD_SX}
          value={content.contact.whatsappNumber}
          onChange={(e) =>
            updateField("contact", "whatsappNumber", e.target.value)
          }
        />
        <TextField
          label="Instagram Handle"
          fullWidth
          sx={FIELD_SX}
          value={content.contact.instagramHandle}
          onChange={(e) =>
            updateField("contact", "instagramHandle", e.target.value)
          }
        />
        <TextField
          label="Instagram URL"
          fullWidth
          sx={FIELD_SX}
          value={content.contact.instagramUrl}
          onChange={(e) =>
            updateField("contact", "instagramUrl", e.target.value)
          }
        />
        <TextField
          label="Email"
          fullWidth
          sx={FIELD_SX}
          value={content.contact.email}
          onChange={(e) => updateField("contact", "email", e.target.value)}
        />
        <TextField
          label="Office Hours"
          fullWidth
          value={content.contact.officeHours}
          onChange={(e) =>
            updateField("contact", "officeHours", e.target.value)
          }
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `2px solid ${colors.border}`,
          borderRadius: "14px",
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 2 }}>Homepage Hero</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Headline"
              value={content.hero?.headline || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    headline: e.target.value,
                  },
                }))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Headline Highlight"
              value={content.hero?.headlineHighlight || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    headlineHighlight: e.target.value,
                  },
                }))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tagline"
              multiline
              rows={3}
              value={content.hero?.tagline || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    tagline: e.target.value,
                  },
                }))
              }
            />
          </Grid>

          {/* ADD THIS */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hero Video URL"
              placeholder="https://example.com/video.mp4"
              value={content.hero?.videoUrl || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    videoUrl: e.target.value,
                  },
                }))
              }
              helperText="Video URL displayed in the homepage Hero section."
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `2px solid ${colors.border}`,
          borderRadius: "14px",
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 2 }}>About Me</Typography>
        <PhotoUploadRow
          label="About Section Photo"
          photoUrl={content.about.photoUrl}
          uploading={uploadingAbout}
          onUpload={(e) => handlePhotoUpload("about", setUploadingAbout, e)}
        />
        <TextField
          label="Introduction"
          fullWidth
          multiline
          rows={2}
          sx={FIELD_SX}
          value={content.about.intro}
          onChange={(e) => updateField("about", "intro", e.target.value)}
        />
        <TextField
          label="Background"
          fullWidth
          multiline
          rows={2}
          value={content.about.background}
          onChange={(e) => updateField("about", "background", e.target.value)}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `2px solid ${colors.border}`,
          borderRadius: "14px",
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 1 }}>
          Consultation Fee (Displayed)
        </Typography>
        <Typography
          sx={{ fontSize: "0.82rem", color: colors.textLight, mb: 2 }}
        >
          This updates the price shown on the site. It does NOT change what
          Razorpay actually charges — that's set separately by the backend's
          CONSULTATION_FEE_INR setting. Keep both in sync manually.
        </Typography>
        <TextField
          label="Fee (INR)"
          type="number"
          sx={{ maxWidth: 200 }}
          value={content.consultationFeeInr}
          onChange={(e) =>
            updateTopLevel("consultationFeeInr", Number(e.target.value))
          }
        />
      </Paper>

      <Button
        variant="contained"
        size="large"
        startIcon={<SaveIcon />}
        onClick={handleSave}
        disabled={saving}
        sx={{ background: gradientBrand, py: 1.5, px: 4 }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </Box>
  );
}

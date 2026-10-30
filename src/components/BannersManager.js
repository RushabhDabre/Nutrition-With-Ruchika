import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Avatar,
  Collapse,
  Chip,
  Tabs,
  Tab,
  Card,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import CampaignIcon from "@mui/icons-material/Campaign";
import LayersIcon from "@mui/icons-material/Layers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { colors, gradientBrand } from "../theme";
import { adminFetch } from "../utils/adminAuth";
import { uploadMediaFile } from "../supabaseClient";
import { useFeedback } from "../context/FeedbackContext";

const emptyForm = {
  id: null,
  title: "",
  subtitle: "",
  imageUrl: "",
  linkUrl: "",
  buttonText: "",
  displayType: "STRIP",
  startDate: "",
  endDate: "",
  active: true,
  paymentRequired: false,
  priceInr: "",
};

export default function BannersManager() {
  const { showSnackbar, showConfirm } = useFeedback();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0 = STRIP, 1 = MODAL
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const currentType = activeTab === 0 ? "STRIP" : "MODAL";
  const isModal = form.displayType === "MODAL";

  const load = useCallback(() => {
    setLoading(true);
    adminFetch("/api/admin/banners")
      .then((res) => res.json())
      .then(setItems)
      .catch((err) =>
        showSnackbar(err.message || "Failed to load promotions", "error"),
      )
      .finally(() => setLoading(false));
  }, [showSnackbar]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadMediaFile(file, "banners");
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (publishLive) => {
    setError("");
    if (!form.title.trim()) {
      setError("Please enter a title or headline.");
      return;
    }
    if (isModal && !form.imageUrl) {
      setError("Please upload an image/poster for the popup flyer.");
      return;
    }
    if (
      form.paymentRequired &&
      (!form.priceInr || Number(form.priceInr) <= 0)
    ) {
      setError(
        "Please enter a valid price in INR for this online payment offer.",
      );
      return;
    }

    setSaving(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const path = form.id
        ? `/api/admin/banners/${form.id}`
        : "/api/admin/banners";
      const payload = {
        ...form,
        displayType: currentType,
        active: publishLive,
        paymentRequired: Boolean(form.paymentRequired),
        priceInr:
          form.paymentRequired && form.priceInr ? Number(form.priceInr) : null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      const res = await adminFetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed.");

      showSnackbar(
        publishLive
          ? `"${payload.title}" is now LIVE on your website!`
          : `Saved "${payload.title}" to your Previous library.`,
        "success",
      );

      setForm(emptyForm);
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (item) => {
    try {
      const res = await adminFetch(`/api/admin/banners/${item.id}/activate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Could not activate promotion.");
      showSnackbar(`"${item.title}" is now LIVE on your website!`, "success");
      load();
    } catch (err) {
      showSnackbar(err.message || "Failed to activate promotion", "error");
    }
  };

  const handleDeactivate = async (item) => {
    const ok = await showConfirm({
      title: "Take down promotion?",
      message: `"${item.title}" will be taken down from your website and moved to your Previous library.`,
      confirmText: "Turn Off",
      type: "warning",
    });
    if (!ok) return;

    try {
      const res = await adminFetch(`/api/admin/banners/${item.id}/deactivate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Could not deactivate promotion.");
      showSnackbar(
        `Promotion turned off and moved to Previous library.`,
        "info",
      );
      load();
    } catch (err) {
      showSnackbar(err.message || "Failed to deactivate promotion", "error");
    }
  };

  const handleEdit = (item) => {
    setForm({
      ...emptyForm,
      ...item,
      paymentRequired: Boolean(item.paymentRequired),
      priceInr: item.priceInr != null ? item.priceInr : "",
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    setForm({ ...emptyForm, displayType: currentType });
    setFormOpen(true);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setFormOpen(false);
    setError("");
  };

  const handleDelete = async (item) => {
    const ok = await showConfirm({
      title: "Delete promotion permanently?",
      message: `Are you sure you want to permanently delete "${item.title}"?`,
      confirmText: "Delete",
      type: "error",
    });
    if (!ok) return;

    try {
      await adminFetch(`/api/admin/banners/${item.id}`, { method: "DELETE" });
      showSnackbar("Promotion deleted.", "success");
      load();
    } catch (err) {
      showSnackbar(err.message || "Failed to delete promotion", "error");
    }
  };

  // Filter items for current tab
  const tabItems = items.filter((b) => b.displayType === currentType);
  const liveItem = tabItems.find((b) => b.active);
  const previousItems = tabItems.filter((b) => !b.active);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      {/* Tab Switcher */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 0.5,
          borderRadius: 3,
          bgcolor: "#f1f5f9",
          border: "1px solid #e2e8f0",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, v) => {
            setActiveTab(v);
            setFormOpen(false);
            setForm(emptyForm);
            setError("");
          }}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: "0.92rem",
              textTransform: "none",
              borderRadius: 2.5,
              transition: "all 0.2s",
              "&.Mui-selected": {
                bgcolor: "#ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              },
            },
          }}
        >
          <Tab
            icon={<CampaignIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Top Announcement Strip"
          />
          <Tab
            icon={<LayersIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Popup Modal Flyer"
          />
        </Tabs>
      </Paper>

      <Alert
        severity="info"
        sx={{ mb: 3, borderRadius: 2.5, fontSize: "0.85rem" }}
      >
        <strong>One Active Promotion Rule:</strong> You can show at most{" "}
        <strong>one live Top Strip</strong> and{" "}
        <strong>one live Popup Flyer</strong> on your site. Clicking{" "}
        <strong>Apply</strong> on any saved promotion immediately puts it live
        and archives the previous one into your library.
      </Alert>

      {/* SECTION 1: CURRENTLY LIVE ON SITE */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
          Currently Live on Website
        </Typography>

        {liveItem ? (
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "2px solid #10b981",
              bgcolor: "rgba(16, 185, 129, 0.04)",
              position: "relative",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2.5}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ minWidth: 0, flex: 1 }}
              >
                <Avatar
                  variant="rounded"
                  src={liveItem.imageUrl || undefined}
                  sx={{
                    width: currentType === "MODAL" ? 64 : 48,
                    height: currentType === "MODAL" ? 72 : 48,
                    bgcolor: "#e2e8f0",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {!liveItem.imageUrl && "🎉"}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 0.5, flexWrap: "wrap", gap: 0.5 }}
                  >
                    <Chip
                      size="small"
                      icon={
                        <CheckCircleIcon sx={{ fontSize: "14px !important" }} />
                      }
                      label="LIVE ON WEBSITE"
                      color="success"
                      sx={{ fontWeight: 800, fontSize: "0.72rem", height: 24 }}
                    />
                    {liveItem.paymentRequired && (
                      <Chip
                        size="small"
                        label={`₹${liveItem.priceInr} · Direct Online Payment`}
                        color="primary"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          height: 24,
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ fontSize: "1.05rem" }}
                  >
                    {liveItem.title}
                  </Typography>

                  {liveItem.subtitle && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.25 }}
                    >
                      {liveItem.subtitle}
                    </Typography>
                  )}

                  {liveItem.buttonText && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      CTA Button: <strong>{liveItem.buttonText}</strong>
                    </Typography>
                  )}
                </Box>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(liveItem)}
                  sx={{ borderRadius: 2 }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  startIcon={<PowerSettingsNewIcon />}
                  onClick={() => handleDeactivate(liveItem)}
                  sx={{ borderRadius: 2 }}
                >
                  Turn Off
                </Button>
              </Stack>
            </Stack>
          </Card>
        ) : (
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "2px dashed #cbd5e1",
              bgcolor: "#f8fafc",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              fontWeight={700}
              color="text.secondary"
              gutterBottom
            >
              No {currentType === "MODAL" ? "Popup Flyer" : "Top Strip"} is
              currently live
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 2 }}
            >
              Visitors will see the standard clean site without any{" "}
              {currentType === "MODAL" ? "popups" : "top announcements"}.
            </Typography>
            {!formOpen && (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                sx={{
                  background: gradientBrand,
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                Create &amp; Publish Now
              </Button>
            )}
          </Card>
        )}
      </Box>

      {/* CREATE / EDIT ACTION BUTTON */}
      {!formOpen && liveItem && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ background: gradientBrand, borderRadius: 2, fontWeight: 700 }}
          >
            Create New {currentType === "MODAL" ? "Flyer" : "Strip Promotion"}
          </Button>
        </Box>
      )}

      {/* FORM ACCORDION */}
      <Collapse in={formOpen}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            border: `2px solid ${colors.border}`,
            borderRadius: 3.5,
            bgcolor: "#ffffff",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ mb: 2, fontSize: "1rem" }}
          >
            {form.id
              ? "Edit Promotion"
              : `New ${currentType === "MODAL" ? "Popup Flyer" : "Top Strip"}`}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label={
              isModal
                ? "Promotion Title (e.g. Diwali Festive Transformation)"
                : "Headline (Shown in header bar)"
            }
            size="small"
            fullWidth
            required
            sx={{ mb: 2 }}
            placeholder={
              isModal
                ? "e.g. Navratri 9-Day Fasting & Detox Plan"
                : "e.g. Navratri Special — 9-Day Gut Reset Plan at ₹999!"
            }
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          {!isModal && (
            <TextField
              label="Subtitle (optional, hidden on mobile screens)"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              placeholder="e.g. Customized fasting meal plan + daily WhatsApp guidance"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          )}

          {/* Special Festive Offer Settings */}
          <Box
            sx={{
              p: 2.5,
              mb: 2.5,
              borderRadius: 2.5,
              bgcolor: form.paymentRequired
                ? "rgba(56, 75, 50, 0.05)"
                : "#f8fafc",
              border: `1px solid ${form.paymentRequired ? colors.primary : "#e2e8f0"}`,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(form.paymentRequired)}
                  onChange={(e) =>
                    setForm({ ...form, paymentRequired: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography fontWeight={700} sx={{ fontSize: "0.92rem" }}>
                    Enable Direct Online Payment (Festive / Special Offer)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Clicking the banner CTA triggers instant Razorpay checkout
                    (e.g. Navratri, Diwali special diet plan).
                  </Typography>
                </Box>
              }
            />

            {form.paymentRequired && (
              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Offer Price in INR (₹)"
                  type="number"
                  size="small"
                  required
                  placeholder="e.g. 999"
                  value={form.priceInr}
                  onChange={(e) =>
                    setForm({ ...form, priceInr: e.target.value })
                  }
                  helperText="The exact amount charged via Razorpay"
                />
                <TextField
                  label="Enroll Button Text"
                  size="small"
                  placeholder="e.g. Enroll Now (defaults to Enroll Now · ₹...)"
                  value={form.buttonText}
                  onChange={(e) =>
                    setForm({ ...form, buttonText: e.target.value })
                  }
                />
              </Box>
            )}
          </Box>

          {!form.paymentRequired && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Button Text (optional)"
                size="small"
                placeholder="e.g. Book Now"
                value={form.buttonText}
                onChange={(e) =>
                  setForm({ ...form, buttonText: e.target.value })
                }
              />
              <TextField
                label="External Link URL (optional)"
                size="small"
                placeholder="https://..."
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              />
            </Box>
          )}

          {/* Image Upload */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2.5 }}>
            <Avatar
              variant="rounded"
              src={form.imageUrl || undefined}
              sx={
                isModal
                  ? { width: 72, height: 90, bgcolor: "#f1f5f9" }
                  : { width: 44, height: 44, bgcolor: "#f1f5f9" }
              }
            />
            <Box sx={{ flex: 1 }}>
              <Button
                component="label"
                size="small"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                disabled={uploading}
                sx={{ borderRadius: 2 }}
              >
                {uploading
                  ? "Uploading..."
                  : isModal
                    ? "Upload Flyer Poster"
                    : "Upload Small Badge Icon (optional)"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {isModal
                  ? "The full graphic/flyer image to show centered on screen."
                  : "Optional small icon shown next to the headline."}
              </Typography>
            </Box>
          </Box>

          {/* Optional Schedule */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              label="Start Date (optional)"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={form.startDate || ""}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <TextField
              label="End Date (optional)"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={form.endDate || ""}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="contained"
              size="medium"
              disabled={saving}
              startIcon={<RocketLaunchIcon />}
              onClick={() => handleSave(true)}
              sx={{
                background: gradientBrand,
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              {saving ? "Publishing..." : "Publish Now (Set Live)"}
            </Button>
            <Button
              variant="outlined"
              size="medium"
              disabled={saving}
              onClick={() => handleSave(false)}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Save to Library (Draft)
            </Button>
            <Button
              size="medium"
              onClick={handleCancel}
              sx={{ color: "text.secondary" }}
            >
              Cancel
            </Button>
          </Stack>
        </Paper>
      </Collapse>

      {/* SECTION 2: PREVIOUS & SAVED PROMOTIONS LIBRARY */}
      <Box>
        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
          Previous &amp; Saved Promotions ({previousItems.length})
        </Typography>

        {loading ? (
          <CircularProgress size={24} />
        ) : previousItems.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No previous saved promotions in this library.
            </Typography>
          </Card>
        ) : (
          <Stack spacing={1.5}>
            {previousItems.map((item) => (
              <Card
                key={item.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  },
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ minWidth: 0, flex: 1 }}
                  >
                    <Avatar
                      variant="rounded"
                      src={item.imageUrl || undefined}
                      sx={{
                        width: currentType === "MODAL" ? 52 : 40,
                        height: currentType === "MODAL" ? 60 : 40,
                        bgcolor: "#f1f5f9",
                        fontSize: "1rem",
                        flexShrink: 0,
                      }}
                    >
                      {!item.imageUrl && "🎉"}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 0.3, flexWrap: "wrap", gap: 0.5 }}
                      >
                        <Typography variant="body1" fontWeight={700} noWrap>
                          {item.title}
                        </Typography>
                        {item.paymentRequired && (
                          <Chip
                            size="small"
                            label={`₹${item.priceInr || 0} · Direct Pay`}
                            color="primary"
                            sx={{
                              height: 20,
                              fontSize: "0.68rem",
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Stack>

                      {item.subtitle && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {item.subtitle}
                        </Typography>
                      )}

                      <Typography variant="caption" color="text.secondary">
                        {item.startDate
                          ? `${item.startDate} → ${item.endDate || "indefinite"}`
                          : "No date restriction"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<RocketLaunchIcon />}
                      onClick={() => handleActivate(item)}
                      sx={{
                        background: gradientBrand,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2,
                      }}
                    >
                      Apply (Set Live)
                    </Button>
                    <IconButton size="small" onClick={() => handleEdit(item)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

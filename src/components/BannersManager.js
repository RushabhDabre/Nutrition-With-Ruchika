import React, { useState, useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { colors, gradientBrand } from "../theme";
import { adminFetch } from "../utils/adminAuth";
import { uploadMediaFile } from "../supabaseClient";

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
  displayOrder: 0,
  active: true,
};

export default function BannersManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    adminFetch("/api/admin/banners")
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

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

  const handleSave = async () => {
    setError("");
    try {
      const method = form.id ? "PUT" : "POST";
      const path = form.id
        ? `/api/admin/banners/${form.id}`
        : "/api/admin/banners";
      const payload = {
        ...form,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };
      const res = await adminFetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed.");
      setForm(emptyForm);
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({ ...emptyForm, ...item });
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setForm(emptyForm);
    setFormOpen(true);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setFormOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    await adminFetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3, fontSize: "0.85rem" }}>
        This shows as a slim announcement strip below the header (like "🎉 New
        Year Offer — 20% off!"), not a full-size image — keep the title short
        and punchy.
      </Alert>

      {!formOpen && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ background: gradientBrand, mb: 3 }}
        >
          Add Banner
        </Button>
      )}

      <Collapse in={formOpen}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            border: `2px solid ${colors.border}`,
            borderRadius: "12px",
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 2, fontSize: "0.95rem" }}>
            {form.id ? "Edit Banner" : "New Banner"}
          </Typography>

          <TextField
            label="Headline (shown to visitors)"
            size="small"
            fullWidth
            sx={{ mb: 1.5 }}
            placeholder="e.g. New Year Offer — 20% off Transformation Program!"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Subtitle (optional, hidden on mobile)"
            size="small"
            fullWidth
            sx={{ mb: 1.5 }}
            placeholder="e.g. Valid till 31st January"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />

          <TextField
            select
            label="Show as"
            size="small"
            fullWidth
            sx={{ mb: 1.5 }}
            value={form.displayType}
            onChange={(e) => setForm({ ...form, displayType: e.target.value })}
            helperText={
              form.displayType === "MODAL"
                ? "Centered popup - shows once per visit, reopenable via a small floating button"
                : "Slim announcement bar below the header"
            }
          >
            <MenuItem value="STRIP">Top Strip</MenuItem>
            <MenuItem value="MODAL">Popup Modal</MenuItem>
          </TextField>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <TextField
              label="Button Text (optional)"
              size="small"
              placeholder="e.g. Book Now"
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
            />
            <TextField
              label="Link URL (optional)"
              size="small"
              placeholder="Where the button goes"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <Avatar
              variant="rounded"
              src={form.imageUrl || undefined}
              sx={{ width: 40, height: 40, bgcolor: colors.bgLight }}
            />
            <Box sx={{ flex: 1 }}>
              <Button
                component="label"
                size="small"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Small Icon (optional)"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography
                sx={{ fontSize: "0.72rem", color: colors.textLight, mt: 0.5 }}
              >
                Optional — a small badge/icon, not a full graphic. Looks fine
                without one too.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              mb: 1.5,
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <TextField
              label="Order"
              type="number"
              size="small"
              sx={{ width: 90 }}
              value={form.displayOrder}
              onChange={(e) =>
                setForm({ ...form, displayOrder: Number(e.target.value) })
              }
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                />
              }
              label="Active"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              sx={{ background: gradientBrand }}
            >
              {form.id ? "Update" : "Add"}
            </Button>
            <Button size="small" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <Box sx={{ display: "grid", gap: 1 }}>
          {items.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                p: 1.25,
                border: `1px solid ${colors.border}`,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar
                variant="rounded"
                src={item.imageUrl || undefined}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: colors.bgLight,
                  fontSize: "1rem",
                }}
              >
                {!item.imageUrl && "🎉"}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}{" "}
                  {!item.active && (
                    <span style={{ color: colors.textLight, fontWeight: 400 }}>
                      (inactive)
                    </span>
                  )}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: colors.textLight }}
                >
                  {item.displayType === "MODAL" ? "Popup" : "Strip"} ·{" "}
                  {item.startDate || "always"} → {item.endDate || "no end"}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => handleEdit(item)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(item.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
          {items.length === 0 && (
            <Typography sx={{ color: colors.textLight, fontSize: "0.88rem" }}>
              No banners yet.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

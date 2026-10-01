import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import { createConsultationPlan, createPlanPaymentLink, getConsultationPlans } from "../utils/bookingsApi.js";

export default function PlanSelectionDialog({ open, booking, onClose, onSuccess }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingPlanId, setCreatingPlanId] = useState(null);
  const [error, setError] = useState("");
  const [createdLink, setCreatedLink] = useState(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", priceInr: "", description: "" });
  const [customSaving, setCustomSaving] = useState(false);

  const loadPlans = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getConsultationPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setCreatedLink(null);
    setCustomOpen(false);
    loadPlans();
  }, [open]);

  const handleCreateLink = async (plan) => {
    if (!booking?.id) return;
    setCreatingPlanId(plan.id);
    setError("");

    try {
      const result = await createPlanPaymentLink(booking.id, plan.id);
      setCreatedLink(result);
      onSuccess?.(result);
    } catch (err) {
      setError(err.message || "Could not create payment link.");
    } finally {
      setCreatingPlanId(null);
    }
  };

  const handleCreateCustomPlan = async () => {
    setCustomSaving(true);
    setError("");
    try {
      await createConsultationPlan({
        name: customForm.name.trim(),
        priceInr: Number(customForm.priceInr),
        description: customForm.description.trim(),
      });
      setCustomForm({ name: "", priceInr: "", description: "" });
      setCustomOpen(false);
      await loadPlans();
    } catch (err) {
      setError(err.message || "Could not create the custom plan.");
    } finally {
      setCustomSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>
          Select a Nutrition Plan
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {booking?.name ? `Choose a plan for ${booking.name}` : "Choose a plan"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}

          {createdLink && (
            <Alert
              severity="success"
              icon={<LinkIcon />}
              action={
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => navigator.clipboard?.writeText(createdLink.shortUrl)}
                >
                  Copy
                </Button>
              }
            >
              <Typography fontWeight={700}>Payment link created</Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-all", mt: 0.5 }}>
                {createdLink.shortUrl}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {createdLink.emailSent ? "The client was emailed the link." : "The link was created. Email delivery was not confirmed."}
              </Typography>
            </Alert>
          )}

          {loading ? (
            <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {plans.map((plan) => (
                <Grid item xs={12} sm={6} key={plan.id}>
                  <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: 1 }}>
                      <Stack spacing={1.25}>
                        <Typography variant="h6" fontWeight={800}>{plan.name}</Typography>
                        <Typography variant="h5" fontWeight={800}>₹{Number(plan.priceInr || 0).toLocaleString("en-IN")}</Typography>
                        <Typography variant="body2" color="text.secondary">{plan.description}</Typography>
                      </Stack>
                    </CardContent>
                    <Box sx={{ px: 2, pb: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={Boolean(creatingPlanId)}
                        onClick={() => handleCreateLink(plan)}
                      >
                        {creatingPlanId === plan.id ? <CircularProgress size={20} color="inherit" /> : "Create Payment Link"}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    minHeight: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderStyle: "dashed",
                  }}
                >
                  <Button startIcon={<AddCircleOutlineIcon />} onClick={() => setCustomOpen(true)}>
                    Create Custom Plan
                  </Button>
                </Card>
              </Grid>
            </Grid>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      <Dialog open={customOpen} onClose={() => !customSaving && setCustomOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Custom Plan</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <TextField
              label="Plan name"
              value={customForm.name}
              onChange={(e) => setCustomForm((current) => ({ ...current, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Price (INR)"
              type="number"
              value={customForm.priceInr}
              onChange={(e) => setCustomForm((current) => ({ ...current, priceInr: e.target.value }))}
              fullWidth
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Description"
              value={customForm.description}
              onChange={(e) => setCustomForm((current) => ({ ...current, description: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={customSaving} onClick={() => setCustomOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={customSaving || !customForm.name.trim() || !Number(customForm.priceInr) || !customForm.description.trim()}
            onClick={handleCreateCustomPlan}
          >
            {customSaving ? <CircularProgress size={20} color="inherit" /> : "Create Plan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

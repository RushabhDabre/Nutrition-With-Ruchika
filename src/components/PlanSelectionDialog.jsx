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
import { createConsultationPlan, createPlanPaymentLink, getConsultationPlans, getBookingPaymentLinks } from "../utils/bookingsApi.js";
import { useFeedback } from "../context/FeedbackContext";

export default function PlanSelectionDialog({ open, booking, onClose, onSuccess }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingPlanId, setCreatingPlanId] = useState(null);
  const [createdLink, setCreatedLink] = useState(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", priceInr: "", description: "" });
  const [customSaving, setCustomSaving] = useState(false);
  const [existingLinks, setExistingLinks] = useState([]);
  const { showSnackbar, showConfirm } = useFeedback();

  const loadPlansAndLinks = React.useCallback(async () => {
    setLoading(true);
    try {
      const [plansData, linksData] = await Promise.all([
        getConsultationPlans(),
        booking?.id ? getBookingPaymentLinks(booking.id).catch(() => []) : Promise.resolve([])
      ]);
      setPlans(Array.isArray(plansData) ? plansData : []);
      setExistingLinks(Array.isArray(linksData) ? linksData : []);
    } catch (err) {
      showSnackbar(err.message || "Could not load plans.", "error");
    } finally {
      setLoading(false);
    }
  }, [booking, showSnackbar]);

  useEffect(() => {
    if (!open) return;
    setCreatedLink(null);
    setCustomOpen(false);
    loadPlansAndLinks();
  }, [open, booking, loadPlansAndLinks]);

  const activePaidLink = existingLinks.find(l => l.status === 'PAID');

  const handleCreateLink = async (plan) => {
    if (!booking?.id) return;
    
    // Check if a link already exists for this booking
    const activeLink = existingLinks.find(l => l.status === 'PAID' || l.status === 'CREATED');
    if (activeLink) {
      const isPaid = activeLink.status === 'PAID';
      const proceed = await showConfirm({
        title: isPaid ? 'Payment Already Received!' : 'Payment Link Already Exists!',
        message: isPaid 
          ? `"${activeLink.planNameSnapshot}" — ₹${Number(activeLink.amountInr || 0).toLocaleString("en-IN")} is already marked as PAID.\n\nAre you sure you want to create a duplicate link for "${plan.name}"?`
          : `There is already an active payment link for "${activeLink.planNameSnapshot}".\n\nAre you sure you want to create a new one for "${plan.name}"?`,
        type: 'warning',
        confirmText: 'Create Anyway'
      });
      if (!proceed) return;
    }

    setCreatingPlanId(plan.id);

    try {
      const result = await createPlanPaymentLink(booking.id, plan.id);
      setCreatedLink(result);
      showSnackbar("Payment link generated successfully!", "success");
      onSuccess?.(result);
      loadPlansAndLinks(); // Refresh list to show newly created one
    } catch (err) {
      showSnackbar(err.message || "Could not create payment link.", "error");
    } finally {
      setCreatingPlanId(null);
    }
  };

  const handleCreateCustomPlan = async () => {
    setCustomSaving(true);
    try {
      await createConsultationPlan({
        name: customForm.name.trim(),
        priceInr: Number(customForm.priceInr),
        description: customForm.description.trim(),
      });
      setCustomForm({ name: "", priceInr: "", description: "" });
      setCustomOpen(false);
      showSnackbar("Custom plan created!", "success");
      await loadPlansAndLinks();
    } catch (err) {
      showSnackbar(err.message || "Could not create the custom plan.", "error");
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
          {activePaidLink && (
            <Alert severity="warning" sx={{ fontWeight: 500 }}>
              Payment already received for <b>{activePaidLink.planNameSnapshot}</b> (₹{Number(activePaidLink.amountInr || 0).toLocaleString("en-IN")}). You generally do not need to create another payment link.
            </Alert>
          )}

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

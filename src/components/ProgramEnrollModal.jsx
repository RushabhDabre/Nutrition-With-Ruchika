import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { colors, gradientBrand } from "../theme";
import { apiBaseUrl } from "../data/siteData";
import { loadRazorpayScript } from "../utils/loadRazorpay";

export default function ProgramEnrollModal({ open, onClose, plan }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  if (!plan) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setError("Please fill in your name, WhatsApp number, and email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await loadRazorpayScript();

      // 1. Create Order on backend
      const res = await fetch(`${apiBaseUrl}/api/programs/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.isBanner ? null : plan.id,
          bannerId: plan.bannerId || (plan.isBanner ? plan.id : null),
          planName: plan.name,
          amountInr: plan.priceInr || plan.price,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
          notes: formData.notes.trim(),
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Could not initialize checkout. Please try again.");
      }

      const orderData = await res.json();

      // 2. Open Razorpay Modal
      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Nutrition with Ruchika",
        description: `Enrollment: ${plan.name}`,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: colors.primary,
        },
        handler: async (response) => {
          try {
            setLoading(true);
            const verifyRes = await fetch(`${apiBaseUrl}/api/programs/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed. If money was debited, please contact us.");
            }

            const verifiedData = await verifyRes.json();
            setSuccess(verifiedData);
          } catch (verErr) {
            setError(verErr.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (err) {
      setError(err.message || "Failed to start enrollment. Please try again.");
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!loading) {
      setError("");
      setSuccess(null);
      setFormData({ name: "", phone: "", email: "", city: "", notes: "" });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3.5, overflow: "hidden" },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: gradientBrand,
          color: colors.white,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2.2,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="800" sx={{ color: colors.white }}>
            {success ? "Enrollment Confirmed!" : `Join ${plan.name}`}
          </Typography>
          {!success && (
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
              Direct Online Enrollment via Secure Razorpay
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleModalClose} sx={{ color: colors.white }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        {success ? (
          /* Success Screen */
          <Box sx={{ textAlign: "center", py: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 68, color: colors.success, mb: 1.5 }} />
            <Typography variant="h5" fontWeight="800" gutterBottom>
              You're In! 🎉
            </Typography>
            <Typography paragraph color="text.secondary">
              Thank you, <strong>{success.clientName}</strong>! Your enrollment for{" "}
              <strong>{success.planName}</strong> is confirmed.
            </Typography>

            <Box
              sx={{
                bgcolor: "#f8fafc",
                p: 2.5,
                borderRadius: 2.5,
                border: "1px solid #e2e8f0",
                my: 2.5,
                textAlign: "left",
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.8 }}>
                <strong>Amount Paid:</strong> ₹{success.amountPaidInr}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.8 }}>
                <strong>Payment ID:</strong> {success.razorpayPaymentId}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.8 }}>
                <strong>WhatsApp Number:</strong> {success.clientPhone}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#ecfdf5",
                color: "#065f46",
                px: 2,
                py: 1.2,
                borderRadius: 2,
                border: "1px solid #a7f3d0",
                mb: 2,
              }}
            >
              <WhatsAppIcon sx={{ color: "#10b981", fontSize: 20 }} />
              <Typography variant="body2" fontWeight="600">
                Ruchika will reach out via WhatsApp within 24 hours to begin your plan!
              </Typography>
            </Box>
          </Box>
        ) : (
          /* Enrollment Form */
          <Box component="form" onSubmit={handleEnroll} sx={{ mt: 1 }}>
            {/* Price Preview Card */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#f8fafc",
                p: 2,
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                mb: 2.5,
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="700">
                  {plan.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {plan.description || "Comprehensive Dietary Guidance & Support"}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h5" fontWeight="800" sx={{ color: colors.primary }}>
                  ₹{plan.priceInr || plan.price}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  All-Inclusive
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                size="small"
                placeholder="e.g. Priya Sharma"
              />

              <TextField
                label="WhatsApp Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                fullWidth
                size="small"
                placeholder="e.g. 9876543210"
                helperText="Ruchika will message you on this WhatsApp number to send your diet plan."
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                size="small"
                placeholder="e.g. priya@gmail.com"
                helperText="A payment receipt and invoice will be sent here."
              />

              <TextField
                label="City / Location"
                name="city"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                size="small"
                placeholder="e.g. Mumbai, Pune, Delhi"
              />

              <TextField
                label="Goals or Medical Notes (Optional)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                size="small"
                placeholder="e.g. Fasting diet plan, PCOS weight loss, thyroid management..."
              />
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                background: gradientBrand,
                py: 1.4,
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: 2,
                boxShadow: "0 4px 15px rgba(56, 75, 50, 0.3)",
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: colors.white }} />
              ) : (
                `Pay ₹${plan.priceInr || plan.price} & Enroll Now`
              )}
            </Button>
          </Box>
        )}
      </DialogContent>

      {success && (
        <DialogActions sx={{ pb: 3, px: 3, justifyContent: "center" }}>
          <Button
            onClick={handleModalClose}
            variant="contained"
            sx={{
              background: gradientBrand,
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Done
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

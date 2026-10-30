import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CheckIcon from "@mui/icons-material/Check";
import { colors } from "../theme";
import { apiBaseUrl, dietTypeOptions } from "../data/siteData";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import {
  savePendingPayment,
  getPendingPayment,
  clearPendingPayment,
  getPaymentRecoveryStatus,
} from "../utils/paymentRecovery";
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";
import DateTabPicker from "./DateTabPicker";
import { getUserFacingError } from "../utils/userFacingError";

const steps = ["1. Pick Slot", "2. Your Info", "3. Confirm & Pay"];

const GOAL_OPTIONS = [
  { label: "Weight Loss", icon: "🥗" },
  { label: "PCOS & Hormones", icon: "🌸" },
  { label: "Gut Health & Digestion", icon: "🥑" },
  { label: "Thyroid & Diabetes", icon: "🩺" },
  { label: "General Wellness", icon: "✨" },
  { label: "Other", icon: "✏️" },
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  goal: "Weight Loss",
  otherGoal: "",
  bookingDate: "",
  slotStartTime: "",
  // Clinical profile details (can be filled post-payment)
  age: "",
  gender: "",
  weightKg: "",
  heightCm: "",
  city: "",
  dietType: "Vegetarian",
  medication: "",
};

function formatSlotLabel(time) {
  if (!time) return "";
  const hour = parseInt(time.split(":")[0], 10);
  const fmt = (h) => {
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:00 ${period}`;
  };
  return `${fmt(hour)} - ${fmt(hour + 1)}`;
}

function formatBookingDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  const dateLabel = date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${dateLabel} • ${formatSlotLabel(timeStr)}`;
}

export default function BookingFlow() {
  const { isOpen, closeBooking } = useBooking();
  const content = useSiteContent();
  const consultationFee = content.consultationFeeInr || 99;

  // Step 0: Pick Slot, Step 1: Info & Goal, Step 2: Confirm & Pay, Step 3: Confirmed / Health Profile
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [slotPickerKey, setSlotPickerKey] = useState(0);
  const [paymentRecovery, setPaymentRecovery] = useState(null);

  // Post-payment health profile state
  const [savingIntake, setSavingIntake] = useState(false);
  const [intakeSaved, setIntakeSaved] = useState(false);
  const [intakeError, setIntakeError] = useState("");

  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        content_name: "Consultation Intake View",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDateTimeChange = ({ date, time }) => {
    setForm((prev) => ({ ...prev, bookingDate: date, slotStartTime: time }));
    if (errors.bookingDate || errors.slotStartTime) {
      setErrors((prev) => ({
        ...prev,
        bookingDate: undefined,
        slotStartTime: undefined,
      }));
    }
  };

  // Step 1 Validation (Date & Time Slot)
  const validateStep0 = () => {
    const newErrors = {};
    if (!form.bookingDate) newErrors.bookingDate = "Please choose a consultation date";
    if (!form.slotStartTime) newErrors.slotStartTime = "Please select an available time slot";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation (Essential Contact: Name, Phone, Email, Goal)
  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name || form.name.trim() === "") newErrors.name = "Full name is required";
    if (!form.phone || !/^[0-9+\-\s]{7,15}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit mobile number";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.goal) newErrors.goal = "Select your primary health goal";
    if (form.goal === "Other" && (!form.otherGoal || form.otherGoal.trim() === ""))
      newErrors.otherGoal = "Please specify your goal";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToDetails = () => {
    if (validateStep0()) {
      setActiveStep(1);
    }
  };

  const handleContinueToReview = () => {
    if (validateStep1()) {
      setApiError("");
      setActiveStep(2);
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "InitiateCheckout", {
          content_name: "1-on-1 Consultation Booking",
          value: consultationFee,
          currency: "INR",
        });
      }
    }
  };

  const openRazorpay = (orderData) => {
    const razorpay = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: "Nutrition with Ruchika",
      description: "1-on-1 Consultation Fee (adjustable against your plan)",
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: colors.primaryDark },

      handler: async (response) => {
        try {
          const verifyRes = await fetch(
            `${apiBaseUrl}/api/bookings/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.error || "Payment verification failed.");
          }

          clearPendingPayment();

          if (verifyData.booking) {
            setForm((prev) => ({
              ...prev,
              name: verifyData.booking.name ?? prev.name,
              email: verifyData.booking.email ?? prev.email,
              phone: verifyData.booking.phone ?? prev.phone,
              bookingDate: verifyData.booking.bookingDate ?? prev.bookingDate,
              slotStartTime:
                verifyData.booking.slotStartTime ?? prev.slotStartTime,
            }));
          }

          setPaymentRecovery(null);
          setConfirmedBooking(verifyData.booking);
          setActiveStep(3); // Move to Confirmed & Post-Payment Intake

          if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "Purchase", {
              value: Number(verifyData.booking?.amountPaidInr || consultationFee),
              currency: "INR",
              content_name: "1-on-1 Consultation Booking",
              content_type: "product",
            });
          }
        } catch (err) {
          setApiError(getUserFacingError(err));
        } finally {
          setSubmitting(false);
        }
      },

      modal: {
        ondismiss: () => {
          setSubmitting(false);
        },
      },
    });

    razorpay.on("payment.failed", () => {
      setApiError("Payment was not completed. Please try again.");
      setSubmitting(false);
    });

    razorpay.open();
  };

  const handlePay = async () => {
    setSubmitting(true);
    setApiError("");
    try {
      await loadRazorpayScript();

      const effectiveGoal =
        form.goal === "Other" && form.otherGoal ? form.otherGoal : form.goal;

      // Clean payload: sends essentials, with fallbacks for optional clinical details
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        goal: effectiveGoal || "General Wellness",
        bookingDate: form.bookingDate,
        slotStartTime: form.slotStartTime,
        age: form.age ? Number(form.age) : 25,
        gender: form.gender || "Pending Intake",
        weightKg: form.weightKg ? Number(form.weightKg) : 60.0,
        heightCm: form.heightCm ? Number(form.heightCm) : 165.0,
        city: form.city || "Online",
        dietType: form.dietType || "Vegetarian",
        medication: form.medication || "",
      };

      const orderRes = await fetch(`${apiBaseUrl}/api/bookings/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        if (orderRes.status === 409) {
          setActiveStep(0);
          setErrors((prev) => ({ ...prev, slotStartTime: orderData.error }));
          setForm((prev) => ({ ...prev, slotStartTime: "" }));
          setSlotPickerKey((k) => k + 1);
        }
        throw new Error(
          orderData.error || "Could not initialize payment. Please try again."
        );
      }

      savePendingPayment({
        orderId: orderData.orderId,
        amount: orderData.amount / 100,
        currency: orderData.currency,
        keyId: orderData.keyId,
        bookingDate: form.bookingDate,
        slotStartTime: form.slotStartTime,
      });

      openRazorpay(orderData);
    } catch (err) {
      setApiError(getUserFacingError(err));
      setSubmitting(false);
    }
  };

  // Post-payment clinical profile submission
  const handleSaveIntake = async () => {
    if (!confirmedBooking?.id) return;
    setSavingIntake(true);
    setIntakeError("");
    try {
      const intakePayload = {
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        weightKg: form.weightKg ? Number(form.weightKg) : null,
        heightCm: form.heightCm ? Number(form.heightCm) : null,
        city: form.city || null,
        dietType: form.dietType || null,
        medication: form.medication || null,
      };

      const res = await fetch(
        `${apiBaseUrl}/api/bookings/${confirmedBooking.id}/intake`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(intakePayload),
        }
      );

      if (!res.ok) {
        throw new Error("Could not update profile right now.");
      }
      setIntakeSaved(true);
    } catch (err) {
      setIntakeError(err.message || "Could not update profile right now.");
    } finally {
      setSavingIntake(false);
    }
  };

  const handleClose = () => {
    closeBooking();
    setTimeout(() => {
      setActiveStep(0);
      setForm(initialForm);
      setErrors({});
      setApiError("");
      setConfirmedBooking(null);
      setIntakeSaved(false);
      setSlotPickerKey((k) => k + 1);
    }, 300);
  };

  useEffect(() => {
    const pending = getPendingPayment();
    if (!pending) return;

    let cancelled = false;
    let timer = null;

    const checkStatus = async () => {
      if (cancelled) return;
      try {
        const status = await getPaymentRecoveryStatus(pending.orderId);
        if (cancelled) return;

        setPaymentRecovery({ ...status, orderId: pending.orderId });

        if (status.status === "CONFIRMED") {
          clearPendingPayment();
          return;
        }

        if (status.status === "PAID") {
          timer = setTimeout(checkStatus, 5000);
          return;
        }

        if (status.status === "NOT_FOUND") {
          clearPendingPayment();
          setPaymentRecovery(null);
          return;
        }
      } catch (err) {
        console.error("Payment recovery check failed:", err);
      }
    };

    checkStatus();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      scroll="body"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 24px 60px -10px rgba(0, 0, 0, 0.2)",
          bgcolor: "#FFFFFF",
        },
      }}
    >
      {/* Sleek Top Brand Accent Strip */}
      <Box sx={{ height: 4, bgcolor: colors.primaryDark }} />

      {/* Header Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2.5, sm: 3.5 },
          pt: 2.5,
          pb: 1,
        }}
      >
        {/* Sleek Micro-Stepper Pills */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {steps.map((label, idx) => {
            const isCurrent = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.25,
                  py: 0.45,
                  borderRadius: "20px",
                  fontSize: "0.72rem",
                  fontWeight: isCurrent ? 700 : 500,
                  bgcolor: isCurrent
                    ? colors.primaryDark
                    : isCompleted
                    ? colors.bgSage
                    : "transparent",
                  color: isCurrent
                    ? "#ffffff"
                    : isCompleted
                    ? colors.primaryDark
                    : colors.textLight,
                  transition: "all 0.2s ease",
                }}
              >
                {isCompleted ? (
                  <CheckIcon sx={{ fontSize: 13, color: colors.primaryDark }} />
                ) : null}
                <span>{label}</span>
              </Box>
            );
          })}
        </Box>

        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: colors.textMuted,
            "&:hover": { bgcolor: colors.bgSage },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, pb: 3.5, pt: 1.5 }}>
        {paymentRecovery && paymentRecovery.status === 'PAID' && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: "12px" }}>
            We detected a recent payment attempt. Verifying confirmation...
          </Alert>
        )}
        {apiError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {apiError}
          </Alert>
        )}

        {/* =========================================================================
            SLIDE 1: PICK CONSULTATION TIME SLOT
            ========================================================================= */}
        {activeStep === 0 && (
          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.45rem" },
                fontWeight: 800,
                color: colors.textDark,
                mb: 0.4,
              }}
            >
              Select Consultation Time
            </Typography>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: colors.textMuted,
                mb: 2.5,
              }}
            >
              45-60 min private 1-on-1 video call • ₹{consultationFee} (100% adjustable
              against any program)
            </Typography>

            {/* Availability Picker */}
            <Box sx={{ mb: 2 }}>
              <DateTabPicker
                key={slotPickerKey}
                value={{ date: form.bookingDate, time: form.slotStartTime }}
                onChange={handleDateTimeChange}
                days={15}
              />
              {errors.slotStartTime && (
                <Typography
                  sx={{ color: "#d32f2f", fontSize: "0.75rem", mt: 0.75 }}
                >
                  {errors.slotStartTime}
                </Typography>
              )}
            </Box>

            {/* Selected Slot Feedback Banner */}
            {form.bookingDate && form.slotStartTime ? (
              <Box
                sx={{
                  bgcolor: colors.bgSage,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "14px",
                  p: 1.5,
                  mb: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                <CalendarMonthIcon sx={{ color: colors.primaryDark, fontSize: 22 }} />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: colors.primaryDark,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Selected Slot
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: colors.textDark,
                    }}
                  >
                    {formatBookingDateTime(form.bookingDate, form.slotStartTime)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: colors.textLight,
                  textAlign: "center",
                  mb: 2.5,
                }}
              >
                Please pick a date tab and an available time slot above to continue.
              </Typography>
            )}

            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={!form.bookingDate || !form.slotStartTime}
              onClick={handleContinueToDetails}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: colors.primaryDark,
                color: "#ffffff",
                py: 1.35,
                borderRadius: "28px",
                fontSize: "0.9rem",
                fontWeight: 700,
                boxShadow: "0 6px 20px rgba(56, 75, 50, 0.25)",
                "&:hover": {
                  bgcolor: colors.darkGreenHover,
                },
                "&.Mui-disabled": {
                  bgcolor: "#E5E5DF",
                  color: "#9E9E96",
                },
              }}
            >
              Continue to Your Details
            </Button>
          </Box>
        )}

        {/* =========================================================================
            SLIDE 2: ESSENTIAL DETAILS & HEALTH GOAL (FAST & FRICTIONLESS!)
            ========================================================================= */}
        {activeStep === 1 && (
          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.45rem" },
                fontWeight: 800,
                color: colors.textDark,
                mb: 0.4,
              }}
            >
              Your Information
            </Typography>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: colors.textMuted,
                mb: 2.5,
              }}
            >
              Only the essentials needed to confirm your consultation slot.
            </Typography>

            <Stack spacing={2} sx={{ mb: 2.5 }}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="e.g. Ananya Sharma"
                fullWidth
                size="small"
                InputProps={{
                  sx: { borderRadius: "12px", bgcolor: colors.bgCream },
                }}
              />

              <TextField
                label="WhatsApp / Mobile Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone || "We'll send your meeting link and reminders on WhatsApp"}
                placeholder="e.g. 9876543210"
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <WhatsAppIcon sx={{ color: "#25D366", mr: 1, fontSize: 19 }} />
                  ),
                  sx: { borderRadius: "12px", bgcolor: colors.bgCream },
                }}
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email || "For your Google Calendar invite and confirmation receipt"}
                placeholder="e.g. ananya@gmail.com"
                fullWidth
                size="small"
                InputProps={{
                  sx: { borderRadius: "12px", bgcolor: colors.bgCream },
                }}
              />

              {/* 1-Tap Health Goal Chips */}
              <Box sx={{ pt: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: colors.textDark,
                    mb: 1.25,
                  }}
                >
                  What is your primary health goal?
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {GOAL_OPTIONS.map((g) => {
                    const isSelected = form.goal === g.label;
                    return (
                      <Chip
                        key={g.label}
                        label={`${g.icon} ${g.label}`}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, goal: g.label }));
                          if (errors.goal)
                            setErrors((prev) => ({ ...prev, goal: undefined }));
                        }}
                        sx={{
                          borderRadius: "18px",
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "0.8rem",
                          py: 1.8,
                          px: 0.5,
                          bgcolor: isSelected ? colors.primaryDark : colors.bgSage,
                          color: isSelected ? "#ffffff" : colors.textDark,
                          border: isSelected
                            ? "none"
                            : `1px solid ${colors.border}`,
                          transition: "all 0.15s ease",
                          "&:hover": {
                            bgcolor: isSelected
                              ? colors.darkGreenHover
                              : "rgba(56, 75, 50, 0.12)",
                          },
                        }}
                      />
                    );
                  })}
                </Box>
                {errors.goal && (
                  <Typography
                    sx={{ color: "#d32f2f", fontSize: "0.75rem", mt: 0.75 }}
                  >
                    {errors.goal}
                  </Typography>
                )}

                {form.goal === "Other" && (
                  <TextField
                    sx={{ mt: 1.5 }}
                    label="Please specify your health goal"
                    name="otherGoal"
                    value={form.otherGoal}
                    onChange={handleChange}
                    error={!!errors.otherGoal}
                    helperText={errors.otherGoal}
                    size="small"
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "12px", bgcolor: colors.bgCream },
                    }}
                  />
                )}
              </Box>
            </Stack>

            {/* Confidentiality Callout */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(56, 75, 50, 0.05)",
                p: 1.25,
                borderRadius: "12px",
                mb: 2.5,
              }}
            >
              <LockOutlinedIcon sx={{ color: colors.primaryDark, fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.74rem", color: colors.textMuted }}>
                100% Confidential. Clinical body metrics (height, weight, medical history)
                can be submitted right after checkout.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                onClick={() => setActiveStep(0)}
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderRadius: "28px",
                  py: 1.2,
                  px: 2.5,
                  borderColor: colors.border,
                  color: colors.textDark,
                  "&:hover": { borderColor: colors.primaryDark },
                }}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleContinueToReview}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: colors.primaryDark,
                  color: "#ffffff",
                  py: 1.2,
                  borderRadius: "28px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  boxShadow: "0 6px 20px rgba(56, 75, 50, 0.25)",
                  "&:hover": { bgcolor: colors.darkGreenHover },
                }}
              >
                Proceed to Review &amp; Pay
              </Button>
            </Stack>
          </Box>
        )}

        {/* =========================================================================
            SLIDE 3: REVIEW & SECURE CHECKOUT
            ========================================================================= */}
        {activeStep === 2 && (
          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.45rem" },
                fontWeight: 800,
                color: colors.textDark,
                mb: 0.4,
              }}
            >
              Confirm &amp; Secure Checkout
            </Typography>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: colors.textMuted,
                mb: 2.5,
              }}
            >
              Review your consultation summary before proceeding to payment.
            </Typography>

            {/* Order Review Card */}
            <Box
              sx={{
                bgcolor: colors.bgCream,
                border: `1px solid ${colors.border}`,
                borderRadius: "16px",
                p: 2.5,
                mb: 2.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: colors.primaryDark,
                  mb: 1.5,
                }}
              >
                Appointment Summary
              </Typography>

              <SummaryRow
                label="Date & Time"
                value={formatBookingDateTime(
                  form.bookingDate,
                  form.slotStartTime
                )}
                bold
              />
              <SummaryRow label="Patient Name" value={form.name} />
              <SummaryRow
                label="Contact"
                value={`${form.phone} • ${form.email}`}
              />
              <SummaryRow
                label="Health Focus"
                value={form.goal === "Other" ? form.otherGoal : form.goal}
              />

              <Divider sx={{ my: 1.5 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: colors.textDark }}>
                    Consultation Fee
                  </Typography>
                  <Typography sx={{ fontSize: "0.74rem", color: colors.primaryDark, fontWeight: 600 }}>
                    100% adjustable against any monthly/100-day plan
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: colors.primaryDark,
                  }}
                >
                  ₹{consultationFee}
                </Typography>
              </Box>
            </Box>

            {/* Payment Trust Badges */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
                mb: 2.5,
                color: colors.textLight,
                fontSize: "0.74rem",
              }}
            >
              <span>🔒 256-Bit SSL Razorpay</span>
              <span>•</span>
              <span>UPI / GPay / Cards / NetBanking</span>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                onClick={() => setActiveStep(1)}
                disabled={submitting}
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderRadius: "28px",
                  py: 1.25,
                  px: 2.5,
                  borderColor: colors.border,
                  color: colors.textDark,
                  "&:hover": { borderColor: colors.primaryDark },
                }}
              >
                Edit Details
              </Button>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handlePay}
                disabled={submitting}
                sx={{
                  bgcolor: colors.primaryDark,
                  color: "#ffffff",
                  py: 1.35,
                  borderRadius: "28px",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  boxShadow: "0 6px 20px rgba(56, 75, 50, 0.25)",
                  "&:hover": { bgcolor: colors.darkGreenHover },
                }}
              >
                {submitting ? (
                  <CircularProgress size={22} sx={{ color: "#ffffff" }} />
                ) : (
                  `Pay ₹${consultationFee} & Confirm Booking`
                )}
              </Button>
            </Stack>
          </Box>
        )}

        {/* =========================================================================
            SLIDE 4: CONFIRMED & POST-PAYMENT HEALTH PROFILE INTAKE FORM!
            ========================================================================= */}
        {activeStep === 3 && confirmedBooking && (
          <Box sx={{ textAlign: "center" }}>
            <CheckCircleIcon
              sx={{ fontSize: "3.5rem", color: colors.primaryDark, mb: 1 }}
            />
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.4rem", sm: "1.6rem" },
                fontWeight: 800,
                color: colors.textDark,
                mb: 0.5,
              }}
            >
              You're Booked, {form.name.split(" ")[0]}!
            </Typography>
            <Typography
              sx={{
                color: colors.textMuted,
                fontSize: "0.85rem",
                mb: 2.5,
                maxWidth: 440,
                mx: "auto",
              }}
            >
              A calendar invite and receipt has been sent to <strong>{form.email}</strong>.
              Your meeting link is ready below.
            </Typography>

            {/* Video Call & Appointment Card */}
            <Box
              sx={{
                bgcolor: colors.bgSage,
                border: `1px solid ${colors.border}`,
                borderRadius: "16px",
                p: 2.5,
                mb: 3,
                textAlign: "left",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <EventAvailableIcon sx={{ color: colors.primaryDark }} />
                <Typography sx={{ fontWeight: 700, color: colors.textDark, fontSize: "0.92rem" }}>
                  {formatBookingDateTime(
                    confirmedBooking.bookingDate || form.bookingDate,
                    confirmedBooking.slotStartTime || form.slotStartTime
                  )}
                </Typography>
              </Box>

              {confirmedBooking.meetingLink && (
                <Button
                  component="a"
                  href={confirmedBooking.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  fullWidth
                  variant="outlined"
                  startIcon={<VideoCameraFrontIcon />}
                  sx={{
                    mt: 1,
                    py: 1,
                    borderRadius: "12px",
                    fontWeight: 700,
                    color: colors.primaryDark,
                    borderColor: colors.primaryDark,
                    "&:hover": { bgcolor: "rgba(56, 75, 50, 0.08)" },
                  }}
                >
                  Open Video Meeting Link
                </Button>
              )}
            </Box>

            {/* ===================================================================
                THE USER'S PROPOSED CLINICAL HEALTH PROFILE FORM (POST-PAYMENT)
                =================================================================== */}
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: `1.5px solid ${colors.border}`,
                borderRadius: "18px",
                p: { xs: 2, sm: 2.75 },
                mb: 3,
                textAlign: "left",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontSize: "0.98rem",
                    fontWeight: 800,
                    color: colors.textDark,
                  }}
                >
                  📋 Pre-Consultation Health Profile (Takes 60 Seconds)
                </Typography>
                <Typography
                  sx={{ fontSize: "0.78rem", color: colors.textMuted, mt: 0.3 }}
                >
                  Help Dietitian Ruchika review your clinical history before the call
                  for deeper personalized recommendations.
                </Typography>
              </Box>

              {intakeSaved ? (
                <Alert
                  severity="success"
                  sx={{ borderRadius: "12px", bgcolor: colors.bgSage }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                    Health Profile Saved Successfully!
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", mt: 0.25 }}>
                    Ruchika will review your metrics and prepare your customized roadmap
                    before the session.
                  </Typography>
                </Alert>
              ) : (
                <Stack spacing={1.75}>
                  {intakeError && (
                    <Alert severity="error" sx={{ borderRadius: "10px" }}>
                      {intakeError}
                    </Alert>
                  )}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1.5,
                    }}
                  >
                    <TextField
                      label="Age"
                      name="age"
                      type="number"
                      size="small"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="e.g. 28"
                      InputProps={{ sx: { borderRadius: "10px" } }}
                    />
                    <TextField
                      select
                      label="Gender"
                      name="gender"
                      size="small"
                      value={form.gender}
                      onChange={handleChange}
                      InputProps={{ sx: { borderRadius: "10px" } }}
                    >
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField
                      label="Weight (kg)"
                      name="weightKg"
                      type="number"
                      size="small"
                      value={form.weightKg}
                      onChange={handleChange}
                      placeholder="e.g. 64"
                      InputProps={{ sx: { borderRadius: "10px" } }}
                    />
                    <TextField
                      label="Height (cm)"
                      name="heightCm"
                      type="number"
                      size="small"
                      value={form.heightCm}
                      onChange={handleChange}
                      placeholder="e.g. 165"
                      InputProps={{ sx: { borderRadius: "10px" } }}
                    />
                    <TextField
                      label="City"
                      name="city"
                      size="small"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Pune, Mumbai"
                      InputProps={{ sx: { borderRadius: "10px" } }}
                    />
                    <TextField
                      select
                      label="Diet Type"
                      name="dietType"
                      size="small"
                      value={form.dietType}
                      onChange={handleChange}
                      InputProps={{ sx: { borderRadius: "10px" } }}
                    >
                      {dietTypeOptions.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <TextField
                    label="Current Medications or Health Conditions (Optional)"
                    name="medication"
                    size="small"
                    value={form.medication}
                    onChange={handleChange}
                    placeholder="e.g. Thyronorm 50mcg, Metformin, acidity tablets, etc."
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{ sx: { borderRadius: "10px" } }}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={savingIntake}
                    onClick={handleSaveIntake}
                    sx={{
                      bgcolor: colors.primaryDark,
                      color: "#ffffff",
                      py: 1.1,
                      borderRadius: "14px",
                      fontWeight: 700,
                      fontSize: "0.86rem",
                      "&:hover": { bgcolor: colors.darkGreenHover },
                    }}
                  >
                    {savingIntake ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      "Save My Health Profile ✓"
                    )}
                  </Button>

                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      color: colors.textLight,
                      textAlign: "center",
                    }}
                  >
                    In a hurry? A direct link has also been sent to your WhatsApp and Email
                    so you can complete this anytime before your consultation.
                  </Typography>
                </Stack>
              )}
            </Box>

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleClose}
              sx={{
                bgcolor: colors.primaryDark,
                color: "#ffffff",
                py: 1.35,
                borderRadius: "28px",
                fontWeight: 700,
                fontSize: "0.9rem",
                "&:hover": { bgcolor: colors.darkGreenHover },
              }}
            >
              Done &amp; Close
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({ label, value, bold = false }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
      <Typography sx={{ color: colors.textMuted, fontSize: "0.85rem" }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontWeight: bold ? 700 : 600,
          fontSize: "0.86rem",
          color: colors.textDark,
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

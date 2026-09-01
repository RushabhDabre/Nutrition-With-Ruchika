import React, { useState } from 'react';
import {
  Dialog, DialogContent, Box, Typography, TextField, MenuItem, Button,
  Stepper, Step, StepLabel, IconButton, Alert, CircularProgress, Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { colors, gradientBrand } from '../theme';
import { apiBaseUrl, consultationFee, dietTypeOptions, timeSlotOptions } from '../data/siteData';
import { loadRazorpayScript } from '../utils/loadRazorpay';
import { useBooking } from '../context/BookingContext';

const steps = ['Your Details', 'Payment', 'Confirmed'];

const initialForm = {
  name: '', age: '', gender: '', weightKg: '', heightCm: '', goal: '',
  phone: '', email: '', city: '', dietType: '', medication: '', preferredSlot: '',
};

export default function BookingFlow() {
  const { isOpen, closeBooking } = useBooking();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validateStep1 = () => {
    const required = ['name', 'age', 'gender', 'weightKg', 'heightCm', 'goal', 'phone', 'email', 'city', 'dietType', 'preferredSlot'];
    const newErrors = {};
    required.forEach((f) => {
      if (!form[f] || String(form[f]).trim() === '') newErrors[f] = 'Required';
    });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) newErrors.phone = 'Enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateStep1()) {
      setApiError('');
      setActiveStep(1);
    }
  };

  const handlePay = async () => {
    setSubmitting(true);
    setApiError('');
    try {
      await loadRazorpayScript();

      const orderRes = await fetch(`${apiBaseUrl}/api/bookings/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Could not start payment. Please try again.');
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Nutrition with Ruchika',
        description: 'Consultation Booking Fee (adjustable against your program)',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: colors.primary },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${apiBaseUrl}/api/bookings/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }
            setConfirmedBooking(verifyData.booking);
            setActiveStep(2);
          } catch (err) {
            setApiError(err.message);
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });

      razorpay.on('payment.failed', (resp) => {
        setApiError(resp.error?.description || 'Payment failed. Please try again.');
        setSubmitting(false);
      });

      razorpay.open();
    } catch (err) {
      setApiError(err.message);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    closeBooking();
    // Reset after the close animation finishes so the dialog doesn't
    // visibly flash back to step 1 before it disappears.
    setTimeout(() => {
      setActiveStep(0);
      setForm(initialForm);
      setErrors({});
      setApiError('');
      setConfirmedBooking(null);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth scroll="body">
      <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 12, top: 12, zIndex: 1 }}>
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Book Your Consultation</Typography>
        <Typography sx={{ color: colors.textLight, fontSize: '0.9rem', mb: 3 }}>
          ₹{consultationFee} consultation fee — fully adjustable against any program you enroll in
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {apiError && <Alert severity="error" sx={{ mb: 2.5 }}>{apiError}</Alert>}

        {activeStep === 0 && (
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} fullWidth sx={{ gridColumn: '1 / -1' }} />
              <TextField label="Age" name="age" type="number" value={form.age} onChange={handleChange} error={!!errors.age} helperText={errors.age} fullWidth />
              <TextField select label="Gender" name="gender" value={form.gender} onChange={handleChange} error={!!errors.gender} helperText={errors.gender} fullWidth>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField label="Weight (kg)" name="weightKg" type="number" value={form.weightKg} onChange={handleChange} error={!!errors.weightKg} helperText={errors.weightKg} fullWidth />
              <TextField label="Height (cm)" name="heightCm" type="number" value={form.heightCm} onChange={handleChange} error={!!errors.heightCm} helperText={errors.heightCm} fullWidth />
              <TextField label="Your Goal" name="goal" value={form.goal} onChange={handleChange} error={!!errors.goal} helperText={errors.goal} placeholder="e.g. Weight loss, PCOS management" fullWidth sx={{ gridColumn: '1 / -1' }} />
              <TextField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} fullWidth />
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} fullWidth />
              <TextField label="City" name="city" value={form.city} onChange={handleChange} error={!!errors.city} helperText={errors.city} fullWidth />
              <TextField select label="Diet Type" name="dietType" value={form.dietType} onChange={handleChange} error={!!errors.dietType} helperText={errors.dietType} fullWidth>
                {dietTypeOptions.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
              <TextField
                label="Any Medication (optional)" name="medication" value={form.medication} onChange={handleChange}
                placeholder="List any medication you're currently on" fullWidth sx={{ gridColumn: '1 / -1' }}
              />
              <TextField select label="Preferred Time Slot" name="preferredSlot" value={form.preferredSlot} onChange={handleChange} error={!!errors.preferredSlot} helperText={errors.preferredSlot} fullWidth sx={{ gridColumn: '1 / -1' }}>
                {timeSlotOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>
            <Button
              fullWidth size="large" variant="contained" onClick={handleContinueToPayment}
              sx={{ background: gradientBrand, py: 1.6, mt: 1, boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
            >
              Continue to Payment →
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Box sx={{ border: `2px solid ${colors.border}`, borderRadius: '12px', p: 3, mb: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>Booking Summary</Typography>
              <SummaryRow label="Name" value={form.name} />
              <SummaryRow label="Goal" value={form.goal} />
              <SummaryRow label="Preferred Slot" value={form.preferredSlot} />
              <SummaryRow label="Diet Type" value={form.dietType} />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700 }}>Consultation Fee</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: colors.primary }}>₹{consultationFee}</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.8rem', color: colors.textLight, mt: 1 }}>
                Fully adjustable against any program you enroll in afterward
              </Typography>
            </Box>
            <Button
              fullWidth size="large" variant="contained" onClick={handlePay} disabled={submitting}
              sx={{ background: gradientBrand, py: 1.6, boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
            >
              {submitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : `Pay ₹${consultationFee} & Confirm Booking`}
            </Button>
            <Button fullWidth sx={{ mt: 1.5 }} onClick={() => setActiveStep(0)} disabled={submitting}>
              ← Back to details
            </Button>
          </Box>
        )}

        {activeStep === 2 && confirmedBooking && (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: '4rem', color: colors.success, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>You're all set, {form.name.split(' ')[0]}!</Typography>
            <Typography sx={{ color: colors.textLight, mb: 3 }}>
              A confirmation email with your meeting link has been sent to <strong>{form.email}</strong>
            </Typography>
            <Box sx={{ background: colors.bgLight, border: `2px solid ${colors.primary}`, borderRadius: '12px', p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <EventAvailableIcon sx={{ color: colors.primary }} />
                <Typography sx={{ fontWeight: 700 }}>{form.preferredSlot}</Typography>
              </Box>
              <Typography
                component="a" href={confirmedBooking.meetingLink} target="_blank" rel="noreferrer"
                sx={{ color: colors.primary, fontWeight: 700, wordBreak: 'break-all' }}
              >
                {confirmedBooking.meetingLink}
              </Typography>
            </Box>
            <Button fullWidth size="large" variant="contained" onClick={handleClose} sx={{ background: gradientBrand, py: 1.6 }}>
              Done
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.6 }}>
      <Typography sx={{ color: colors.textLight, fontSize: '0.92rem' }}>{label}</Typography>
      <Typography sx={{ fontWeight: 600, fontSize: '0.92rem' }}>{value}</Typography>
    </Box>
  );
}

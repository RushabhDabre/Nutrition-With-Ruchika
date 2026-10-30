import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, MenuItem, Button, Paper, Alert,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { colors, gradientPrimary } from '../theme';
import { concernOptions, apiBaseUrl } from '../data/siteData';
import { useSiteContent } from '../context/SiteContentContext';
import { getWhatsAppUrl, trackWhatsAppClick, trackEvent } from '../utils/analytics';
import SectionTitle from './SectionTitle';

const initialForm = { name: '', phone: '', email: '', concern: '', message: '' };

function ContactCard({ icon, iconBg, title, subtitle, href, onClick }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.85, display: 'flex', gap: 1.75, alignItems: 'center',
        border: '1px solid rgba(0, 0, 0, 0.06)', borderRadius: '16px',
        bgcolor: '#ffffff',
        boxShadow: '0 4px 14px -3px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.25s',
        textDecoration: 'none', color: 'inherit', cursor: href ? 'pointer' : 'default',
        '&:hover': href ? { borderColor: 'rgba(30, 70, 32, 0.25)', transform: 'translateX(4px)' } : {},
      }}
      component={href ? 'a' : 'div'}
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noreferrer' : undefined}
      onClick={onClick}
    >
      <Box
        sx={{
          width: 42, height: 42, borderRadius: '12px', flexShrink: 0, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontSize: '1.2rem',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: '0.94rem', fontWeight: 700, mb: 0.15, color: colors.textDark }}>{title}</Typography>
        <Typography sx={{ color: colors.textLight, fontSize: '0.8rem' }}>{subtitle}</Typography>
      </Box>
    </Paper>
  );
}

export default function Contact() {
  const { contact } = useSiteContent();
  const whatsappLink = getWhatsAppUrl(
    contact.whatsappNumber,
    "Hi Dietitian Ruchika! I saw your website and would like to know more about consultation and diet plans."
  );

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error('Failed to send inquiry. Please reach out via WhatsApp directly.');
      }
      setSubmitted(true);
      trackEvent('Lead', { content_name: 'Contact Form Submission', concern: form.concern });
      setForm(initialForm);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please message me on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="section" id="contact" sx={{ py: { xs: 6, md: 8 }, bgcolor: colors.bgCream, width: "100%" }}>
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="CONTACT"
          title="Start Your Health Transformation"
          subtitle="Fill the quick form below or reach out directly — I typically respond within 24 hours"
          mb={{ xs: 2.5, md: 3 }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.85fr 1.15fr' }, gap: { xs: 2.5, md: 4 }, alignItems: 'start' }}>
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <ContactCard
              icon={<WhatsAppIcon fontSize="small" />}
              iconBg={colors.whatsapp}
              title="WhatsApp"
              subtitle={`+91 ${contact.whatsappNumber ? contact.whatsappNumber.slice(2) : "9876543210"} — fastest response`}
              href={whatsappLink}
              onClick={() => trackWhatsAppClick("Contact Section")}
            />
            <ContactCard
              icon={<InstagramIcon fontSize="small" />}
              iconBg="linear-gradient(135deg,#f09433,#dc2743,#bc1888)"
              title="Instagram"
              subtitle={contact.instagramHandle}
              href={contact.instagramUrl}
            />
            <ContactCard
              icon={<EmailIcon fontSize="small" />}
              iconBg={gradientPrimary}
              title="Email"
              subtitle={contact.email}
              href={`mailto:${contact.email}`}
            />
            <ContactCard
              icon={<AccessTimeIcon fontSize="small" />}
              iconBg={`linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`}
              title="Office Hours"
              subtitle={contact.officeHours}
            />
          </Box>

          <Paper
            elevation={0}
            className="scrollable-content"
            sx={{
              p: { xs: 2.5, sm: 3 },
              border: `1px solid ${colors.border}`,
              borderRadius: '20px',
              boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
              bgcolor: colors.bgWhite,
            }}
          >
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, mb: 0.35, color: colors.textDark }}>
              Request a 1-on-1 Consultation
            </Typography>
            <Typography sx={{ color: colors.textLight, mb: 2, fontSize: '0.84rem' }}>
              Tell me a bit about your health history and I'll get back to you with custom next steps.
            </Typography>

            {submitted && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
                Thank you! I've received your inquiry and will reach out to you within 24 hours.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 1.5 }}>
                <TextField
                  label="Full Name" name="name" size="small" value={form.name} onChange={handleChange}
                  placeholder="Your name" required fullWidth
                  InputProps={{ sx: { borderRadius: "10px" } }}
                />
                <TextField
                  label="Phone Number" name="phone" size="small" value={form.phone} onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX" required fullWidth
                  InputProps={{ sx: { borderRadius: "10px" } }}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 1.5 }}>
                <TextField
                  label="Email Address" name="email" type="email" size="small" value={form.email} onChange={handleChange}
                  placeholder="your@email.com" required fullWidth
                  InputProps={{ sx: { borderRadius: "10px" } }}
                />
                <TextField
                  select label="Primary Goal / Area" name="concern" size="small" value={form.concern} onChange={handleChange}
                  required fullWidth
                  InputProps={{ sx: { borderRadius: "10px" } }}
                >
                  {concernOptions.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                label="Tell me about your lifestyle & routine" name="message" size="small" value={form.message} onChange={handleChange}
                placeholder="E.g., desk job, struggle with evening cravings, PCOS symptoms..." multiline rows={2} fullWidth sx={{ mb: 2 }}
                InputProps={{ sx: { borderRadius: "10px" } }}
              />
              <Button
                type="submit" fullWidth size="medium" variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: colors.primaryDark,
                  color: '#ffffff',
                  py: 1.1,
                  borderRadius: '16px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(56, 75, 50, 0.2)',
                  '&:hover': {
                    bgcolor: colors.darkGreenHover,
                    boxShadow: '0 6px 16px rgba(56, 75, 50, 0.3)',
                  },
                }}
              >
                {loading ? 'Sending Request...' : 'Send Consultation Inquiry →'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

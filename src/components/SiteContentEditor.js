import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Typography, Button, Alert, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { colors, gradientBrand } from '../theme';
import { apiBaseUrl } from '../data/siteData';
import { adminFetch } from '../utils/adminAuth';

const FIELD_SX = { mb: 2 };

export default function SiteContentEditor() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/site-settings`)
      .then((res) => res.json())
      .then(setContent)
      .catch(() => setError('Could not load current content.'))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (section, field, value) => {
    setContent((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    setSaved(false);
  };

  const updateTopLevel = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await adminFetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error('Save failed. Please try again.');
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>;
  if (!content) return <Alert severity="error">{error || 'No content loaded.'}</Alert>;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Saved! Changes are now live on the site.</Alert>}

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: `2px solid ${colors.border}`, borderRadius: '14px' }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>Contact Info</Typography>
        <TextField label="WhatsApp Number (e.g. 919876543210)" fullWidth sx={FIELD_SX}
          value={content.contact.whatsappNumber} onChange={(e) => updateField('contact', 'whatsappNumber', e.target.value)} />
        <TextField label="Instagram Handle" fullWidth sx={FIELD_SX}
          value={content.contact.instagramHandle} onChange={(e) => updateField('contact', 'instagramHandle', e.target.value)} />
        <TextField label="Instagram URL" fullWidth sx={FIELD_SX}
          value={content.contact.instagramUrl} onChange={(e) => updateField('contact', 'instagramUrl', e.target.value)} />
        <TextField label="Email" fullWidth sx={FIELD_SX}
          value={content.contact.email} onChange={(e) => updateField('contact', 'email', e.target.value)} />
        <TextField label="Office Hours" fullWidth
          value={content.contact.officeHours} onChange={(e) => updateField('contact', 'officeHours', e.target.value)} />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: `2px solid ${colors.border}`, borderRadius: '14px' }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>Homepage Hero</Typography>
        <TextField label="Headline" fullWidth sx={FIELD_SX}
          value={content.hero.headline} onChange={(e) => updateField('hero', 'headline', e.target.value)} />
        <TextField label="Headline Highlight (gradient part)" fullWidth sx={FIELD_SX}
          value={content.hero.headlineHighlight} onChange={(e) => updateField('hero', 'headlineHighlight', e.target.value)} />
        <TextField label="Tagline" fullWidth multiline rows={2}
          value={content.hero.tagline} onChange={(e) => updateField('hero', 'tagline', e.target.value)} />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: `2px solid ${colors.border}`, borderRadius: '14px' }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>About Me</Typography>
        <TextField label="Introduction" fullWidth multiline rows={2} sx={FIELD_SX}
          value={content.about.intro} onChange={(e) => updateField('about', 'intro', e.target.value)} />
        <TextField label="Background" fullWidth multiline rows={2}
          value={content.about.background} onChange={(e) => updateField('about', 'background', e.target.value)} />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: `2px solid ${colors.border}`, borderRadius: '14px' }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Consultation Fee (Displayed)</Typography>
        <Typography sx={{ fontSize: '0.82rem', color: colors.textLight, mb: 2 }}>
          This updates the price shown on the site. It does NOT change what Razorpay actually charges —
          that's set separately by the backend's CONSULTATION_FEE_INR setting. Keep both in sync manually.
        </Typography>
        <TextField label="Fee (INR)" type="number" sx={{ maxWidth: 200 }}
          value={content.consultationFeeInr} onChange={(e) => updateTopLevel('consultationFeeInr', Number(e.target.value))} />
      </Paper>

      <Button variant="contained" size="large" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}
        sx={{ background: gradientBrand, py: 1.5, px: 4 }}>
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </Box>
  );
}

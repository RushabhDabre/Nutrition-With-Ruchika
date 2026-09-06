import React, { useState, useEffect } from 'react';
import {
  Box, Paper, TextField, Typography, Button, IconButton, Switch,
  FormControlLabel, CircularProgress, Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { colors, gradientBrand } from '../theme';
import { adminFetch } from '../utils/adminAuth';
import { uploadMediaFile } from '../supabaseClient';

const emptyForm = { id: null, title: '', imageUrl: '', linkUrl: '', startDate: '', endDate: '', displayOrder: 0, active: true };

export default function BannersManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    adminFetch('/api/admin/banners')
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadMediaFile(file, 'banners');
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    try {
      const method = form.id ? 'PUT' : 'POST';
      const path = form.id ? `/api/admin/banners/${form.id}` : '/api/admin/banners';
      const payload = { ...form, startDate: form.startDate || null, endDate: form.endDate || null };
      const res = await adminFetch(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed.');
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    await adminFetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ p: 3, mb: 4, border: `2px solid ${colors.border}`, borderRadius: '14px' }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>{form.id ? 'Edit Banner' : 'Add New Banner / Ad'}</Typography>

        <TextField label="Title (internal reference)" fullWidth sx={{ mb: 2 }}
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <Box sx={{ mb: 2 }}>
          <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Banner Image'}
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {form.imageUrl && <Typography sx={{ fontSize: '0.8rem', color: colors.success, mt: 1 }}>✓ Image uploaded</Typography>}
        </Box>

        <TextField label="Link URL (where clicking it goes - optional)" fullWidth sx={{ mb: 2 }}
          value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <TextField label="Start Date (optional)" type="date" InputLabelProps={{ shrink: true }}
            value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <TextField label="End Date (optional)" type="date" InputLabelProps={{ shrink: true }}
            value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, flexWrap: 'wrap' }}>
          <TextField label="Display Order" type="number" sx={{ width: 130 }}
            value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
          <FormControlLabel
            control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />}
            label="Active"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" onClick={handleSave} sx={{ background: gradientBrand }}>
            {form.id ? 'Update' : 'Add'} Banner
          </Button>
          {form.id && <Button onClick={() => setForm(emptyForm)}>Cancel Edit</Button>}
        </Box>
      </Paper>

      <Typography sx={{ fontWeight: 700, mb: 2 }}>All Banners</Typography>
      {loading ? <CircularProgress /> : (
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {items.map((item) => (
            <Paper key={item.id} elevation={0} sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {item.title}{' '}
                  {!item.active && <span style={{ color: colors.textLight, fontWeight: 400, fontSize: '0.8rem' }}>(inactive)</span>}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: colors.textLight }}>
                  {item.startDate || 'no start'} → {item.endDate || 'no end'}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={() => setForm(item)}><EditIcon fontSize="small" /></IconButton>
                <IconButton onClick={() => handleDelete(item.id)}><DeleteIcon fontSize="small" /></IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

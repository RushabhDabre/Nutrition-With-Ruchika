import React, { useState, useEffect } from 'react';
import {
  Box, Paper, TextField, Typography, Button, MenuItem, Rating,
  IconButton, Switch, FormControlLabel, CircularProgress, Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { colors, gradientBrand } from '../theme';
import { adminFetch } from '../utils/adminAuth';
import { uploadMediaFile } from '../supabaseClient';

const emptyForm = { id: null, type: 'TEXT', clientName: '', tag: '', textContent: '', mediaUrl: '', rating: 5, displayOrder: 0, active: true };

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    adminFetch('/api/admin/testimonials')
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
      const url = await uploadMediaFile(file, 'testimonials');
      setForm((prev) => ({ ...prev, mediaUrl: url }));
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
      const path = form.id ? `/api/admin/testimonials/${form.id}` : '/api/admin/testimonials';
      const res = await adminFetch(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed.');
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    await adminFetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ p: 3, mb: 4, border: `2px solid ${colors.border}`, borderRadius: '14px' }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>{form.id ? 'Edit Testimonial' : 'Add New Testimonial'}</Typography>

        <TextField select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
          sx={{ mb: 2, minWidth: 160 }}>
          <MenuItem value="TEXT">Written</MenuItem>
          <MenuItem value="PHOTO">Photo</MenuItem>
          <MenuItem value="VIDEO">Video</MenuItem>
        </TextField>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <TextField label="Client Name" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          <TextField label="Tag (e.g. Weight Management)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
        </Box>

        <TextField
          label={form.type === 'TEXT' ? 'Testimonial Text' : 'Caption (optional)'}
          multiline rows={3} fullWidth sx={{ mb: 2 }}
          value={form.textContent} onChange={(e) => setForm({ ...form, textContent: e.target.value })}
        />

        {form.type !== 'TEXT' && (
          <Box sx={{ mb: 2 }}>
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={uploading}>
              {uploading ? 'Uploading...' : `Upload ${form.type === 'PHOTO' ? 'Photo' : 'Video'}`}
              <input type="file" hidden accept={form.type === 'PHOTO' ? 'image/*' : 'video/*'} onChange={handleFileChange} />
            </Button>
            {form.mediaUrl && <Typography sx={{ fontSize: '0.8rem', color: colors.success, mt: 1 }}>✓ File uploaded</Typography>}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={{ fontSize: '0.8rem', color: colors.textLight, mb: 0.5 }}>Rating</Typography>
            <Rating value={form.rating} onChange={(e, v) => setForm({ ...form, rating: v })} />
          </Box>
          <TextField label="Display Order" type="number" sx={{ width: 130 }}
            value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
          <FormControlLabel
            control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />}
            label="Active"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" onClick={handleSave} sx={{ background: gradientBrand }}>
            {form.id ? 'Update' : 'Add'} Testimonial
          </Button>
          {form.id && <Button onClick={() => setForm(emptyForm)}>Cancel Edit</Button>}
        </Box>
      </Paper>

      <Typography sx={{ fontWeight: 700, mb: 2 }}>All Testimonials</Typography>
      {loading ? <CircularProgress /> : (
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {items.map((item) => (
            <Paper key={item.id} elevation={0} sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {item.clientName}{' '}
                  <span style={{ fontWeight: 400, color: colors.textLight, fontSize: '0.8rem' }}>
                    ({item.type}{item.active ? '' : ' - inactive'})
                  </span>
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: colors.textLight }}>{item.tag}</Typography>
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

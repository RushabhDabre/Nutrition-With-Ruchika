import React, { useState, useEffect } from 'react';
import {
  Box, Paper, TextField, Typography, Button, IconButton, Switch,
  FormControlLabel, CircularProgress, Alert, Collapse,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { colors, gradientBrand } from '../theme';
import { adminFetch } from '../utils/adminAuth';

/**
 * Generic CRUD admin screen shared by Help Areas, Why Choose Me, Services,
 * and FAQ - they're all "a reorderable list of simple items with an
 * active toggle," just with different fields, so this one component
 * configured differently replaces 4 near-identical files.
 *
 * Props:
 *   apiPath   - e.g. "/api/admin/help-areas" (admin CRUD base path)
 *   itemLabel - e.g. "Help Area" (used in button/heading text)
 *   fields    - [{ name, label, placeholder?, multiline?, rows?, helperText? }]
 *   helpText  - optional info line shown above the Add button
 *   renderPreview - (item) => { primary, secondary } for the list row text
 */
export default function AdminListManager({ apiPath, itemLabel, fields, helpText, renderPreview }) {
  const emptyForm = {
    id: null,
    ...fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {}),
    displayOrder: 0,
    active: true,
  };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    adminFetch(apiPath)
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPath]);

  const handleFieldChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    const missing = fields.find((f) => f.required && !String(form[f.name] || '').trim());
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }
    try {
      const method = form.id ? 'PUT' : 'POST';
      const path = form.id ? `${apiPath}/${form.id}` : apiPath;
      const res = await adminFetch(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed.');
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
    if (!window.confirm(`Delete this ${itemLabel.toLowerCase()}?`)) return;
    await adminFetch(`${apiPath}/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {helpText && <Alert severity="info" sx={{ mb: 3, fontSize: '0.85rem' }}>{helpText}</Alert>}

      {!formOpen && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew} sx={{ background: gradientBrand, mb: 3 }}>
          Add {itemLabel}
        </Button>
      )}

      <Collapse in={formOpen}>
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: `2px solid ${colors.border}`, borderRadius: '12px' }}>
          <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
            {form.id ? `Edit ${itemLabel}` : `New ${itemLabel}`}
          </Typography>

          {fields.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              size="small"
              fullWidth
              multiline={!!f.multiline}
              rows={f.rows}
              placeholder={f.placeholder}
              helperText={f.helperText}
              sx={{ mb: 1.75 }}
              value={form[f.name] || ''}
              onChange={(e) => handleFieldChange(f.name, e.target.value)}
            />
          ))}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              label="Order" type="number" size="small" sx={{ width: 90 }}
              value={form.displayOrder}
              onChange={(e) => handleFieldChange('displayOrder', Number(e.target.value))}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={form.active}
                  onChange={(e) => handleFieldChange('active', e.target.checked)}
                />
              }
              label="Active"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" onClick={handleSave} sx={{ background: gradientBrand }}>
              {form.id ? 'Update' : 'Add'}
            </Button>
            <Button size="small" onClick={handleCancel}>Cancel</Button>
          </Box>
        </Paper>
      </Collapse>

      {loading ? <CircularProgress size={24} /> : (
        <Box sx={{ display: 'grid', gap: 1 }}>
          {items.map((item) => {
            const preview = renderPreview
              ? renderPreview(item)
              : { primary: item[fields[0]?.name] || '', secondary: '' };
            return (
              <Paper
                key={item.id} elevation={0}
                sx={{ p: 1.25, border: `1px solid ${colors.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 1.5 }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {preview.primary} {!item.active && <span style={{ color: colors.textLight, fontWeight: 400 }}>(inactive)</span>}
                  </Typography>
                  {preview.secondary && (
                    <Typography sx={{ fontSize: '0.75rem', color: colors.textLight, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {preview.secondary}
                    </Typography>
                  )}
                </Box>
                <IconButton size="small" onClick={() => handleEdit(item)}><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => handleDelete(item.id)}><DeleteIcon fontSize="small" /></IconButton>
              </Paper>
            );
          })}
          {items.length === 0 && <Typography sx={{ color: colors.textLight, fontSize: '0.88rem' }}>None yet.</Typography>}
        </Box>
      )}
    </Box>
  );
}

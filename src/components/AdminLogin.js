import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { colors, gradientBrand } from '../theme';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChecking(true);
    setError('');
    const ok = await onLogin(username, password);
    if (!ok) setError('Incorrect username or password.');
    setChecking(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: colors.bgLight, p: 2 }}>
      <Paper elevation={0} sx={{ p: 5, maxWidth: 400, width: '100%', border: `2px solid ${colors.border}`, borderRadius: '16px' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Admin Login</Typography>
        <Typography sx={{ color: colors.textLight, fontSize: '0.9rem', mb: 3 }}>Nutrition with Ruchika — Content Manager</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth sx={{ mb: 2 }} autoFocus />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={{ mb: 3 }} />
          <Button type="submit" fullWidth size="large" variant="contained" disabled={checking} sx={{ background: gradientBrand, py: 1.5 }}>
            {checking ? 'Checking...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

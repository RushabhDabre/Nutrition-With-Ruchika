import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab, Typography, Button, AppBar, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { colors } from '../theme';
import AdminLogin from './AdminLogin';
import SiteContentEditor from './SiteContentEditor';
import TestimonialsManager from './TestimonialsManager';
import BannersManager from './BannersManager';
import { getStoredCredentials, storeCredentials, clearCredentials, verifyCredentials } from '../utils/adminAuth';

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const creds = getStoredCredentials();
    if (!creds) {
      setCheckingSession(false);
      return;
    }
    verifyCredentials(creds.username, creds.password).then((ok) => {
      setAuthed(ok);
      if (!ok) clearCredentials();
      setCheckingSession(false);
    });
  }, []);

  const handleLogin = async (username, password) => {
    const ok = await verifyCredentials(username, password);
    if (ok) {
      storeCredentials(username, password);
      setAuthed(true);
    }
    return ok;
  };

  const handleLogout = () => {
    clearCredentials();
    setAuthed(false);
  };

  if (checkingSession) return null;
  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.bgLight }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: colors.white, color: colors.textDark, borderBottom: `1px solid ${colors.border}` }}>
        <Toolbar>
          <Typography sx={{ fontWeight: 800, flexGrow: 1 }}>Nutrition with Ruchika — Admin</Typography>
          <Button onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ color: colors.textLight }}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 4 }} TabIndicatorProps={{ style: { background: colors.primary } }}>
          <Tab label="Site Content" />
          <Tab label="Testimonials" />
          <Tab label="Banners / Ads" />
        </Tabs>

        {tab === 0 && <SiteContentEditor />}
        {tab === 1 && <TestimonialsManager />}
        {tab === 2 && <BannersManager />}
      </Container>
    </Box>
  );
}

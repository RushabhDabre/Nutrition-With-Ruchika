import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Chip,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import { colors } from "../theme";
import AdminLogin from "./AdminLogin";
import SiteContentEditor from "./SiteContentEditor";
import TestimonialsManager from "./TestimonialsManager";
import BannersManager from "./BannersManager";
import AdminListManager from "./AdminListManager";
import { login, logout, getCurrentAdmin } from "../utils/adminAuth";
import BookingsDashboard from "./BookingsDashboard";
import AvailabilityManager from "./AvailabilityManager";
import EmployeeManager from "./EmployeeManager";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getCurrentAdmin()
      .then((admin) => {
        if (admin?.authenticated) {
          setAuthed(true);
          setCurrentUser(admin);
        } else {
          setAuthed(false);
          setCurrentUser(null);
        }
      })
      .catch(() => {
        setAuthed(false);
        setCurrentUser(null);
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);

  const handleLogin = async (username, password) => {
    const ok = await login(username, password);

    if (ok) {
      const admin = await getCurrentAdmin().catch(() => null);
      setCurrentUser(admin);
      setAuthed(true);
      setTab(0);
    }

    return ok;
  };

  const handleLogout = async () => {
    await logout();
    setAuthed(false);
    setCurrentUser(null);
  };

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
  const userPerms = useMemo(
    () => (Array.isArray(currentUser?.permissions) ? currentUser.permissions : []),
    [currentUser?.permissions]
  );

  const visibleTabs = useMemo(() => {
    if (!currentUser) return [];

    const tabDefinitions = [
      {
        id: "bookings",
        label: isSuperAdmin ? "Dashboard" : "My Clients",
        permission: "VIEW_BOOKINGS",
        superAdminOnly: false,
        component: <BookingsDashboard userRole={currentUser.role} permissions={userPerms} />,
      },
      {
        id: "employees",
        label: "Employees",
        superAdminOnly: true,
        component: <EmployeeManager />,
      },
      {
        id: "site-content",
        label: "Site Content",
        permission: "MANAGE_CMS",
        superAdminOnly: false,
        component: <SiteContentEditor />,
      },
      {
        id: "testimonials",
        label: "Testimonials",
        permission: "MANAGE_TESTIMONIALS",
        superAdminOnly: false,
        component: <TestimonialsManager />,
      },
      {
        id: "banners",
        label: "Ads",
        permission: "MANAGE_BANNERS",
        superAdminOnly: false,
        component: <BannersManager />,
      },
      {
        id: "help-areas",
        label: "What I Help With",
        permission: "MANAGE_HELP_AREAS",
        superAdminOnly: false,
        component: (
          <AdminListManager
            apiPath="/api/admin/help-areas"
            itemLabel="Help Area"
            helpText='Shows as a small card in the "What I Help With" strip on the homepage.'
            fields={[
              { name: "icon", label: "Icon (emoji)", placeholder: "e.g. ⚖️" },
              {
                name: "name",
                label: "Name",
                placeholder: "e.g. Weight Management",
                required: true,
              },
            ]}
            renderPreview={(item) => ({
              primary: `${item.icon || ""} ${item.name}`.trim(),
            })}
          />
        ),
      },
      {
        id: "why-choose-me",
        label: "Why Choose Me",
        permission: "MANAGE_WHY_CHOOSE_ME",
        superAdminOnly: false,
        component: (
          <AdminListManager
            apiPath="/api/admin/why-choose-me"
            itemLabel="Reason"
            helpText='Shows as a card in the "Why Choose Nutrition with Ruchika" section.'
            fields={[
              { name: "icon", label: "Icon (emoji)", placeholder: "e.g. 🎯" },
              { name: "title", label: "Title", required: true },
              {
                name: "text",
                label: "Description",
                multiline: true,
                rows: 2,
                required: true,
              },
            ]}
            renderPreview={(item) => ({
              primary: `${item.icon || ""} ${item.title}`.trim(),
              secondary: item.text,
            })}
          />
        ),
      },
      {
        id: "services",
        label: "Services",
        permission: "MANAGE_SERVICES",
        superAdminOnly: false,
        component: (
          <AdminListManager
            apiPath="/api/admin/services"
            itemLabel="Service"
            helpText='Shows as a card in the "Areas I Specialize In" services grid.'
            fields={[
              { name: "icon", label: "Icon (emoji)", placeholder: "e.g. ⚖️" },
              { name: "title", label: "Title", required: true },
              {
                name: "text",
                label: "Description",
                multiline: true,
                rows: 2,
                required: true,
              },
              {
                name: "tags",
                label: "Tags (comma-separated)",
                placeholder: "e.g. Fat Loss, Muscle Gain",
                helperText: "Shown as small pills on the card",
              },
            ]}
            renderPreview={(item) => ({
              primary: `${item.icon || ""} ${item.title}`.trim(),
              secondary: item.tags,
            })}
          />
        ),
      },
      {
        id: "faqs",
        label: "FAQ",
        permission: "MANAGE_FAQ",
        superAdminOnly: false,
        component: (
          <AdminListManager
            apiPath="/api/admin/faqs"
            itemLabel="FAQ"
            helpText="Shows as an expandable question in the FAQ section."
            fields={[
              { name: "question", label: "Question", required: true },
              {
                name: "answer",
                label: "Answer",
                multiline: true,
                rows: 3,
                required: true,
              },
            ]}
            renderPreview={(item) => ({
              primary: item.question,
              secondary: item.answer,
            })}
          />
        ),
      },
      {
        id: "plans",
        label: "Plans",
        superAdminOnly: true,
        component: (
          <AdminListManager
            apiPath="/api/admin/consultation-plans"
            itemLabel="Plan"
            helpText="Pre-configured payment plans that you can select when generating payment links for clients."
            fields={[
              {
                name: "name",
                label: "Plan Name",
                required: true,
                placeholder: "e.g. 1 Month Coaching",
              },
              {
                name: "priceInr",
                label: "Price (INR)",
                type: "number",
                required: true,
                placeholder: "e.g. 1500",
              },
              {
                name: "description",
                label: "Description",
                multiline: true,
                rows: 3,
                required: true,
              },
            ]}
            renderPreview={(item) => ({
              primary: `${item.name} - ₹${item.priceInr}`,
              secondary: item.description,
            })}
          />
        ),
      },
      {
        id: "availability",
        label: "Availability",
        permission: "MANAGE_AVAILABILITY",
        superAdminOnly: false,
        component: <AvailabilityManager />,
      },
    ];

    return tabDefinitions.filter((t) => {
      if (isSuperAdmin) return true;
      if (t.superAdminOnly) return false;
      return userPerms.includes(t.permission);
    });
  }, [currentUser, isSuperAdmin, userPerms]);

  if (checkingSession) return null;
  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  const activeTabIndex = tab >= visibleTabs.length ? 0 : tab;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.bgLight }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: colors.white,
          color: colors.textDark,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontWeight: 800 }}>
              Nutrition with Ruchika — {isSuperAdmin ? "Admin" : "Staff Portal"}
            </Typography>
            <Chip
              icon={
                isSuperAdmin ? (
                  <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />
                ) : (
                  <BadgeIcon sx={{ fontSize: 16 }} />
                )
              }
              label={
                isSuperAdmin
                  ? `${currentUser?.displayName || "Ruchika"} (Admin)`
                  : `${currentUser?.displayName || currentUser?.username} (Staff)`
              }
              size="small"
              sx={{
                bgcolor: isSuperAdmin ? "#e0e7ff" : "#ecfdf5",
                color: isSuperAdmin ? "#4338ca" : "#047857",
                fontWeight: 700,
                display: { xs: "none", sm: "inline-flex" },
              }}
            />
          </Box>

          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: colors.textLight }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
        {visibleTabs.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              Welcome, {currentUser?.displayName || "Staff Member"}!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You do not have access to any dashboard tabs yet. Please ask Ruchika (Admin) to assign you permissions or clients.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={4} sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
            <Tabs
              value={activeTabIndex}
              onChange={(e, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ style: { background: colors.primary } }}
              sx={{ maxWidth: '100%' }}
            >
              {visibleTabs.map((t) => (
                <Tab key={t.id} label={t.label} />
              ))}
            </Tabs>

            <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden' }}>
              {visibleTabs[activeTabIndex]?.component}
            </Box>
          </Stack>
        )}
      </Container>
    </Box>
  );
}

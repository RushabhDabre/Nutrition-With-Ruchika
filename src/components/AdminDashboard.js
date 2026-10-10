import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { colors } from "../theme";
import AdminLogin from "./AdminLogin";
import SiteContentEditor from "./SiteContentEditor";
import TestimonialsManager from "./TestimonialsManager";
import BannersManager from "./BannersManager";
import AdminListManager from "./AdminListManager";
import { login, logout, getCurrentAdmin } from "../utils/adminAuth";
import BookingsDashboard from "./BookingsDashboard";
import AvailabilityManager from "./AvailabilityManager";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getCurrentAdmin()
      .then((admin) => {
        setAuthed(Boolean(admin?.authenticated));
      })
      .catch(() => {
        setAuthed(false);
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);

  const handleLogin = async (username, password) => {
    const ok = await login(username, password);

    if (ok) {
      setAuthed(true);
    }

    return ok;
  };

  const handleLogout = async () => {
    await logout();
    setAuthed(false);
  };

  if (checkingSession) return null;
  if (!authed) return <AdminLogin onLogin={handleLogin} />;

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
          <Typography sx={{ fontWeight: 800, flexGrow: 1 }}>
            Nutrition with Ruchika — Admin
          </Typography>
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: colors.textLight }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4 }}
          TabIndicatorProps={{ style: { background: colors.primary } }}
        >
          <Tab label="Dashboard" />
          <Tab label="Site Content" />
          <Tab label="Testimonials" />
          <Tab label="Ads" />
          <Tab label="What I Help With" />
          <Tab label="Why Choose Me" />
          <Tab label="Services" />
          <Tab label="FAQ" />
          <Tab label="Plans" />
          <Tab label="Availability" />
        </Tabs>

        {tab === 0 && <BookingsDashboard />}
        {tab === 1 && <SiteContentEditor />}
        {tab === 2 && <TestimonialsManager />}
        {tab === 3 && <BannersManager />}

        {tab === 4 && (
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
        )}

        {tab === 5 && (
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
        )}

        {tab === 6 && (
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
        )}

        {tab === 7 && (
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
        )}

        {tab === 8 && (
          <AdminListManager
            apiPath="/api/admin/consultation-plans"
            itemLabel="Plan"
            helpText="Pre-configured payment plans that you can select when generating payment links for clients."
            fields={[
              { name: "name", label: "Plan Name", required: true, placeholder: "e.g. 1 Month Coaching" },
              { name: "priceInr", label: "Price (INR)", type: "number", required: true, placeholder: "e.g. 1500" },
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
        )}

        {tab === 9 && <AvailabilityManager />}
      </Container>
    </Box>
  );
}

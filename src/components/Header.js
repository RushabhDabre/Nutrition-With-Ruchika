import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { colors } from "../theme";
import BrandLogo from "./BrandLogo";
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";
import { getWhatsAppUrl, trackWhatsAppClick } from "../utils/analytics";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Benefits", href: "#benefits" },
  { label: "Programs", href: "#programs" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Tools", href: "#health-tools" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { openBooking } = useBooking();
  const { contact } = useSiteContent();
  const whatsappLink = getWhatsAppUrl(
    contact?.whatsappNumber || "919876543210",
    "Hi Dietitian Ruchika! I saw your website and would like to know more about consultation and diet plans."
  );

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: colors.bgCream,
        color: colors.textDark,
        pt: { xs: 1, md: 1.5 },
        pb: 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            minHeight: "54px !important",
          }}
        >
          {/* Logo */}
          <Box
            component="a"
            href="#home"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              flexShrink: 0,
            }}
          >
            <BrandLogo />
          </Box>

          {/* Yogabn-style Floating Uplifted Nav Pill */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 3.2,
              bgcolor: colors.bgWhite,
              px: 3.5,
              py: 1,
              borderRadius: "40px",
              boxShadow:
                "0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
              border: "none",
            }}
          >
            {navItems.map((item) => (
              <Typography
                key={item.label}
                component="a"
                href={item.href}
                sx={{
                  color: colors.textMuted,
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.84rem",
                  transition: "color 0.15s ease",
                  "&:hover": { color: colors.primaryDark },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          {/* Right Action: Pill Book Button & WhatsApp */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1.25,
              alignItems: "center",
            }}
          >
            <Button
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsAppClick("Header CTA")}
              variant="text"
              startIcon={<WhatsAppIcon sx={{ fontSize: "1.05rem", color: colors.whatsapp }} />}
              sx={{
                color: colors.textDark,
                fontWeight: 500,
                fontSize: "0.84rem",
                px: 1.5,
                py: 0.7,
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              WhatsApp
            </Button>
            <Button
              onClick={openBooking}
              variant="contained"
              sx={{
                bgcolor: colors.primaryDark,
                color: "#ffffff",
                fontWeight: 600,
                borderRadius: "30px",
                px: 2.5,
                py: 0.85,
                fontSize: "0.84rem",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: colors.primary,
                  boxShadow: "none",
                },
              }}
            >
              Book Consultation
            </Button>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: colors.textDark }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 260, pt: 3, px: 2, bgcolor: colors.bgCream, height: "100%" }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <Box sx={{ mb: 2, px: 1 }}>
            <BrandLogo scale={0.88} />
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.label}
                component="a"
                href={item.href}
                sx={{ borderRadius: "8px", py: 1 }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500, color: colors.textDark }}
                />
              </ListItemButton>
            ))}
            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                onClick={openBooking}
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: colors.primaryDark,
                  color: "#fff",
                  py: 1.1,
                  borderRadius: "24px",
                  fontSize: "0.86rem",
                  "&:hover": { bgcolor: colors.primary },
                }}
              >
                Book Consultation
              </Button>
              <Button
                component="a"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                fullWidth
                variant="outlined"
                startIcon={<WhatsAppIcon sx={{ color: colors.whatsapp }} />}
                sx={{
                  borderColor: colors.border,
                  color: colors.textDark,
                  py: 0.9,
                  borderRadius: "24px",
                  fontSize: "0.84rem",
                }}
              >
                WhatsApp Me
              </Button>
            </Box>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

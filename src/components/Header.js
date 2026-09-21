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
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Health Tools", href: "#health-tools" },
  // { label: "Programs", href: "#programs" },
  { label: "Success Stories", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { openBooking } = useBooking();
  const { contact } = useSiteContent();

  const whatsappNumber = contact?.whatsappNumber
    ? String(contact.whatsappNumber).replace(/\D/g, "")
    : "";

  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#";

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleBooking = () => {
    closeDrawer();
    openBooking();
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${colors.border}`,
        color: colors.textDark,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            py: 1.25,
            justifyContent: "space-between",
          }}
        >
          {/* Brand Logo */}
          <Box
            component="a"
            href="#home"
            onClick={closeDrawer}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/assets/images/NutritionWithRuchikaHeader.png"
              alt="Nutrition with Ruchika"
              sx={{
                width: {
                  xs: 145,
                  sm: 165,
                  md: 190,
                },
                height: "auto",
                display: "block",
              }}
            />
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              gap: 3.5,
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Typography
                key={item.label}
                component="a"
                href={item.href}
                sx={{
                  color: colors.textDark,
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  letterSpacing: "0.01em",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: colors.primary,
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          {/* Desktop Actions */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              gap: 1.5,
              alignItems: "center",
            }}
          >
            {/* Book Consultation */}
            <Button
              onClick={openBooking}
              variant="outlined"
              sx={{
                borderWidth: 2,
                borderColor: colors.primary,
                color: colors.primary,
                px: 2.5,
                py: 0.9,
                borderRadius: 50,
                fontWeight: 600,
                fontSize: "0.88rem",
                "&:hover": {
                  borderWidth: 2,
                  borderColor: colors.primaryDark,
                  color: colors.primaryDark,
                  bgcolor: "rgba(121, 152, 91, 0.05)",
                },
              }}
            >
              Book Consultation
            </Button>

            {/* WhatsApp */}
            {whatsappNumber && (
              <Button
                component="a"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                startIcon={<WhatsAppIcon />}
                sx={{
                  bgcolor: colors.whatsapp,
                  color: colors.white,
                  px: 2.5,
                  py: 0.9,
                  borderRadius: 50,
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  boxShadow: "0 4px 15px rgba(37,211,102,0.3)",
                  "&:hover": {
                    bgcolor: "#1fb356",
                  },
                }}
              >
                WhatsApp
              </Button>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            sx={{
              display: {
                xs: "flex",
                lg: "none",
              },
              color: colors.textDark,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <Box
          sx={{
            width: 280,
            pt: 3,
            px: 2,
          }}
          role="presentation"
        >
          {/* Mobile Logo */}
          <Box
            sx={{
              mb: 3,
              px: 1,
            }}
          >
            <Box
              component="img"
              src="/assets/images/NutritionWithRuchikaHeader.png"
              alt="Nutrition with Ruchika"
              sx={{
                width: 150,
                height: "auto",
                display: "block",
              }}
            />
          </Box>

          {/* Navigation Links */}
          <List disablePadding>
            {navItems.map((item) => (
              <ListItemButton
                key={item.label}
                component="a"
                href={item.href}
                onClick={closeDrawer}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            ))}

            {/* Mobile Actions */}
            <Box
              sx={{
                mt: 3,
                px: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Button
                onClick={handleBooking}
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: colors.primary,
                  color: colors.white,
                  borderRadius: 50,
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: colors.primaryDark,
                  },
                }}
              >
                Book a Free Call
              </Button>

              {whatsappNumber && (
                <Button
                  component="a"
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  fullWidth
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    borderWidth: 2,
                    borderColor: colors.whatsapp,
                    color: colors.whatsapp,
                    borderRadius: 50,
                    py: 1.1,
                    fontWeight: 600,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: colors.whatsapp,
                      bgcolor: "rgba(37,211,102,0.08)",
                    },
                  }}
                >
                  WhatsApp Me
                </Button>
              )}
            </Box>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

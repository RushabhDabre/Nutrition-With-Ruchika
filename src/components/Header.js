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
  // { label: 'Programs', href: '#programs' },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { openBooking } = useBooking();
  const { contact } = useSiteContent();
  const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${colors.border}`,
        color: colors.textDark,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ py: 1.5, justifyContent: "space-between" }}
        >
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
            <Box
              component="img"
              src="/assets/images/NutritionWithRuchikaHeader.png"
              alt="Nutrition with Ruchika"
              sx={{
                width: { xs: 150, sm: 175, md: 205 },
                height: "auto",
                display: "block",
              }}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 4,
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Typography
                key={item.label}
                component="a"
                href={item.href}
                sx={{
                  color: colors.textLight,
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.92rem",
                  "&:hover": { color: colors.primary },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Button
              onClick={openBooking}
              variant="outlined"
              sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
            >
              Book Consultation
            </Button>
            <Button
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              variant="contained"
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: colors.whatsapp,
                boxShadow: "0 4px 15px rgba(37,211,102,0.3)",
                "&:hover": { bgcolor: "#1fb356" },
              }}
            >
              WhatsApp
            </Button>
          </Box>

          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 260, pt: 2 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.label} component="a" href={item.href}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={openBooking} sx={{ mt: 1 }}>
              <ListItemText
                primary="Book Consultation"
                primaryTypographyProps={{
                  fontWeight: 700,
                  color: colors.primary,
                }}
              />
            </ListItemButton>
            <ListItemButton
              component="a"
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              <ListItemText
                primary="WhatsApp"
                primaryTypographyProps={{
                  fontWeight: 700,
                  color: colors.whatsapp,
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

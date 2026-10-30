import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Typography, Button, Stack, Fab } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import { colors } from "../theme";
import BrandLogo from "./BrandLogo";
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";
import { getWhatsAppUrl, trackWhatsAppClick } from "../utils/analytics";

export function FinalCTA() {
  const { openBooking } = useBooking();
  const { contact } = useSiteContent();
  const whatsappLink = getWhatsAppUrl(
    contact.whatsappNumber,
    "Hi Dietitian Ruchika! I saw your website and would like to know more about consultation and diet plans."
  );

  return (
    <Box
      sx={{
        bgcolor: colors.primaryDark,
        py: { xs: 6, md: 8 },
        textAlign: "center",
        color: "#ffffff",
      }}
    >
      <Container maxWidth="md">
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: "1.6rem", md: "2.1rem" },
            fontWeight: 700,
            mb: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          Start Your Health Transformation
        </Typography>
        <Typography
          sx={{
            fontSize: "0.94rem",
            opacity: 0.9,
            mb: 3.5,
            maxWidth: 520,
            mx: "auto",
            lineHeight: 1.65,
          }}
        >
          Book a 1-on-1 consultation and get an evidence-based roadmap tailored
          to your body, routine, and health goals.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            onClick={openBooking}
            variant="contained"
            size="large"
            startIcon={<EventIcon sx={{ fontSize: "1.1rem" }} />}
            sx={{
              bgcolor: "#ffffff",
              color: colors.primaryDark,
              py: 1.2,
              px: 3.5,
              borderRadius: "24px",
              fontWeight: 600,
              fontSize: "0.88rem",
              boxShadow: "none",
              "&:hover": { bgcolor: colors.bgCream, boxShadow: "none" },
            }}
          >
            Book Consultation
          </Button>
          <Button
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsAppClick("Final CTA")}
            variant="outlined"
            size="large"
            startIcon={<WhatsAppIcon sx={{ fontSize: "1.1rem" }} />}
            sx={{
              borderColor: "rgba(255,255,255,0.4)",
              color: "#ffffff",
              borderRadius: "24px",
              py: 1.1,
              px: 3,
              fontWeight: 500,
              fontSize: "0.88rem",
              "&:hover": {
                borderColor: "#ffffff",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            WhatsApp Me
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

const footerLinkSx = {
  display: "block",
  color: "#94a3b8",
  textDecoration: "none",
  fontSize: "0.88rem",
  mb: 1.25,
  "&:hover": { color: colors.primary },
};

export function Footer() {
  const { contact } = useSiteContent();
  const whatsappLink = getWhatsAppUrl(
    contact.whatsappNumber,
    "Hi Dietitian Ruchika! I saw your website and would like to know more about consultation and diet plans."
  );

  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#202E1F", color: "#d4ded3", py: 7 }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "1.4fr 1fr 1fr 1fr" },
            gap: 5,
            mb: 5,
          }}
        >
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}>
            <Box sx={{ mb: 2 }}>
              <BrandLogo isDark scale={1.05} />
            </Box>
            <Typography
              sx={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.7 }}
            >
              Helping you build a healthier relationship with food through
              personalized, sustainable nutrition plans.
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                color: colors.white,
                fontWeight: 700,
                mb: 2,
                fontSize: "0.95rem",
              }}
            >
              Quick Links
            </Typography>
            <Box component="a" href="#about" sx={footerLinkSx}>
              About Me
            </Box>
            <Box component="a" href="#services" sx={footerLinkSx}>
              Services
            </Box>
            {/* <Box component="a" href="#programs" sx={footerLinkSx}>Programs</Box> */}
            <Box component="a" href="#testimonials" sx={footerLinkSx}>
              Testimonials
            </Box>
            <Box component="a" href="#faq" sx={footerLinkSx}>
              FAQ
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                color: colors.white,
                fontWeight: 700,
                mb: 2,
                fontSize: "0.95rem",
              }}
            >
              Services
            </Typography>
            <Box component="a" href="#services" sx={footerLinkSx}>
              Weight Management
            </Box>
            <Box component="a" href="#services" sx={footerLinkSx}>
              PCOS Care
            </Box>
            <Box component="a" href="#services" sx={footerLinkSx}>
              Diabetes Control
            </Box>
            <Box component="a" href="#services" sx={footerLinkSx}>
              Women's Nutrition
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                color: colors.white,
                fontWeight: 700,
                mb: 2,
                fontSize: "0.95rem",
              }}
            >
              Connect
            </Typography>
            <Box
              component="a"
              href={contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              sx={{
                ...footerLinkSx,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <InstagramIcon sx={{ fontSize: "1rem" }} /> Instagram
            </Box>
            <Box
              component="a"
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsAppClick("Footer Link")}
              sx={{
                ...footerLinkSx,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <WhatsAppIcon sx={{ fontSize: "1rem" }} /> WhatsApp
            </Box>
            <Box
              component="a"
              href={`mailto:${contact.email}`}
              sx={{
                ...footerLinkSx,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <EmailIcon sx={{ fontSize: "1rem" }} /> Email
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: "1px solid #1e293b",
            pt: 2.75,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            fontSize: "0.82rem",
            color: "#64748b",
          }}
        >
          <Typography sx={{ fontSize: "inherit", color: "inherit" }}>
            Nutrition with Ruchika | Nutritionist & Dietitian ©{" "}
            {new Date().getFullYear()}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 2 } }}>
            <Box
              component={Link}
              to="/privacy-policy"
              sx={{
                color: "#94a3b8",
                textDecoration: "none",
                "&:hover": { color: colors.primary },
              }}
            >
              Privacy Policy
            </Box>
            <Box
              component={Link}
              to="/terms-and-conditions"
              sx={{
                color: "#94a3b8",
                textDecoration: "none",
                "&:hover": { color: colors.primary },
              }}
            >
              Terms & Conditions
            </Box>
            <Box
              component={Link}
              to="/refund-policy"
              sx={{
                color: "#94a3b8",
                textDecoration: "none",
                "&:hover": { color: colors.primary },
              }}
            >
              Refund Policy
            </Box>
            <Box
              component={Link}
              to="/disclaimer"
              sx={{
                color: "#94a3b8",
                textDecoration: "none",
                "&:hover": { color: colors.primary },
              }}
            >
              Disclaimer
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export function WhatsAppFloat() {
  const { contact } = useSiteContent();
  const whatsappLink = getWhatsAppUrl(
    contact.whatsappNumber,
    "Hi Dietitian Ruchika! I saw your website and would like to know more about consultation and diet plans."
  );

  return (
    <Fab
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackWhatsAppClick("Float Button")}
      sx={{
        position: "fixed",
        bottom: { xs: 80, md: 28 },
        right: 28,
        bgcolor: colors.whatsapp,
        color: colors.white,
        width: 62,
        height: 62,
        boxShadow: "0 8px 24px rgba(37,211,102,0.4)",
        animation: "waPulse 3.5s ease-in-out infinite",
        "@keyframes waPulse": {
          "0%, 100%": {
            boxShadow: "0 8px 24px rgba(37,211,102,0.4)",
          },
          "50%": {
            boxShadow: "0 8px 30px rgba(37,211,102,0.7), 0 0 0 10px rgba(37,211,102,0.15)",
          },
        },
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none !important",
        },
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": {
          bgcolor: "#1fb356",
          transform: "scale(1.08)",
          boxShadow: "0 12px 28px rgba(37,211,102,0.6)",
        },
      }}
    >
      <WhatsAppIcon sx={{ fontSize: "1.7rem" }} />
    </Fab>
  );
}

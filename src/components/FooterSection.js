import React from "react";
import { Box, Container, Typography, Button, Stack, Fab } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import { colors, gradientBrand } from "../theme";
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";

export function FinalCTA() {
  const { openBooking } = useBooking();
  const { contact } = useSiteContent();
  const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

  return (
    <Box
      sx={{
        background: gradientBrand,
        py: 9,
        textAlign: "center",
        color: colors.white,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: "2.2rem", mb: 1.75 }}>
          Ready to Start Your Health Journey?
        </Typography>
        <Typography
          sx={{
            fontSize: "1.05rem",
            opacity: 0.95,
            mb: 4,
            maxWidth: 550,
            mx: "auto",
          }}
        >
          Book a free discovery call today and take the first step toward a
          healthier, more energetic you.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
        >
          <Button
            onClick={openBooking}
            variant="contained"
            size="large"
            startIcon={<EventIcon />}
            sx={{
              bgcolor: colors.white,
              color: colors.primary,
              py: 1.6,
              px: 4,
              "&:hover": { bgcolor: "#f1f1f1" },
            }}
          >
            Book Consultation
          </Button>
          <Button
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            size="large"
            startIcon={<WhatsAppIcon />}
            sx={{
              borderColor: colors.white,
              color: colors.white,
              borderWidth: 2,
              py: 1.6,
              px: 4,
              "&:hover": { borderWidth: 2, bgcolor: "rgba(255,255,255,0.15)" },
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
  const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#0f172a", color: "#cbd5e1", py: 7.5 }}
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
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                component="img"
                src="/assets/images/NutritionWithRuchikaFooter.png"
                alt="Nutrition with Ruchika"
                sx={{
                  width: { xs: 150, sm: 175, md: 205 },
                  height: "auto",
                  display: "block",
                }}
              />
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
          <Box>
            <Box
              component="a"
              href="/privacy-policy"
              sx={{
                color: "#94a3b8",
                textDecoration: "none",
                ml: 2,
                "&:hover": { color: colors.primary },
              }}
            >
              Privacy Policy
            </Box>
            <Box
              component="a"
              href="/disclaimer"
              sx={{
                color: "#94a3b8",
                textDecoration: "none",
                ml: 2,
                "&:hover": { color: colors.primary },
              }}
            >
              Disclaimer
            </Box>
            <Box
              component="a"
              href="/terms-and-conditions"
              sx={{
                color: "#94a3b8",
                textDecoration: "none",
                ml: 2,
                "&:hover": { color: colors.primary },
              }}
            >
              Terms & Conditions
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export function WhatsAppFloat() {
  const { contact } = useSiteContent();
  const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

  return (
    <Fab
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      sx={{
        position: "fixed",
        bottom: 28,
        right: 28,
        bgcolor: colors.whatsapp,
        color: colors.white,
        width: 62,
        height: 62,
        boxShadow: "0 8px 24px rgba(37,211,102,0.4)",
        "&:hover": { bgcolor: "#1fb356", transform: "scale(1.1)" },
      }}
    >
      <WhatsAppIcon sx={{ fontSize: "1.7rem" }} />
    </Fab>
  );
}

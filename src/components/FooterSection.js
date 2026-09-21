import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Fab,
  IconButton,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { colors, serifFont } from "../theme";
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";

export function FinalCTA() {
  const { openBooking } = useBooking();
  const { contact } = useSiteContent();

  const whatsappLink = contact?.whatsappNumber
    ? `https://wa.me/${String(contact.whatsappNumber).replace(/\D/g, "")}`
    : "#";

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "#0d1710",
        color: colors.white,
        py: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: { xs: 5, md: 8 },
            alignItems: "center",
          }}
        >
          {/* Left: CTA content */}
          <Box>
            <Typography
              sx={{
                color: "#9db884",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                mb: 1.75,
              }}
            >
              Ready To Transform Your Health?
            </Typography>

            <Typography
              component="h2"
              variant="h2"
              sx={{
                fontFamily: serifFont,
                fontSize: { xs: "2.3rem", sm: "2.9rem", md: "3.4rem" },
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.15,
                mb: 2.5,
              }}
            >
              Let's Create Your Personalized Nutrition Plan
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                color: "rgba(255, 255, 255, 0.82)",
                lineHeight: 1.75,
                mb: 4.5,
                maxWidth: 520,
              }}
            >
              Book your free consultation call today and take the first step
              toward a healthier, happier you.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
            >
              <Button
                onClick={openBooking}
                variant="contained"
                size="large"
                startIcon={<EventIcon />}
                sx={{
                  bgcolor: colors.primary,
                  color: colors.white,
                  py: 1.5,
                  px: 3,
                  borderRadius: 50,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(121, 152, 91, 0.4)",
                  "&:hover": {
                    bgcolor: colors.primaryDark,
                  },
                }}
              >
                Book Your Free Call
              </Button>

              {contact?.whatsappNumber && (
                <Button
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.6)",
                    color: colors.white,
                    borderWidth: 2,
                    py: 1.5,
                    px: 3,
                    borderRadius: 50,
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: colors.white,
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  WhatsApp Me
                </Button>
              )}
            </Stack>
          </Box>

          {/* Right: Healthy food image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
              onError={(event) => {
                event.currentTarget.src = "/assets/images/cta-food-bowl.jpg";
              }}
              alt="Healthy nourish bowl"
              sx={{
                width: { xs: "280px", sm: "360px", md: "420px" },
                height: { xs: "280px", sm: "360px", md: "420px" },
                borderRadius: "50%",
                objectFit: "cover",
                border: "8px solid rgba(255,255,255,0.08)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const footerLinkSx = {
  display: "block",
  color: colors.textLight,
  textDecoration: "none",
  fontSize: "0.88rem",
  mb: 1.25,
  transition: "color 0.2s ease",
  "&:hover": {
    color: colors.primary,
  },
};

const footerHeadingSx = {
  color: colors.textDark,
  fontWeight: 600,
  mb: 2.25,
  fontSize: "0.95rem",
};

export function Footer() {
  const { contact } = useSiteContent();
  const { openBooking } = useBooking();

  const whatsappLink = contact?.whatsappNumber
    ? `https://wa.me/${String(contact.whatsappNumber).replace(/\D/g, "")}`
    : "#";

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#ffffff",
        color: colors.textDark,
        pt: { xs: 8, md: 10 },
        pb: 4,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1.4fr 1fr 1fr 1.2fr",
            },
            gap: { xs: 4, md: 5 },
            mb: { xs: 6, md: 8 },
          }}
        >
          {/* Column 1: Brand */}
          <Box>
            <Box sx={{ mb: 2 }}>
              <Box
                component="img"
                src="/assets/images/NutritionWithRuchikaFooter.png"
                alt="Nutrition with Ruchika"
                sx={{
                  width: { xs: 160, sm: 180, md: 205 },
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: "0.88rem",
                color: colors.textLight,
                lineHeight: 1.7,
                mb: 3,
                maxWidth: 290,
              }}
            >
              Helping you build healthy habits, nourish your body, and live your
              best life through personalized, sustainable nutrition.
            </Typography>

            <Stack direction="row" spacing={1}>
              {contact?.instagramUrl && (
                <IconButton
                  component="a"
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  size="small"
                  aria-label="Instagram"
                  sx={{
                    border: `1px solid ${colors.border}`,
                    color: colors.textDark,
                    "&:hover": {
                      color: colors.primary,
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <InstagramIcon fontSize="small" />
                </IconButton>
              )}

              {contact?.whatsappNumber && (
                <IconButton
                  component="a"
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  size="small"
                  aria-label="WhatsApp"
                  sx={{
                    border: `1px solid ${colors.border}`,
                    color: colors.textDark,
                    "&:hover": {
                      color: colors.whatsapp,
                      borderColor: colors.whatsapp,
                    },
                  }}
                >
                  <WhatsAppIcon fontSize="small" />
                </IconButton>
              )}

              {contact?.email && (
                <IconButton
                  component="a"
                  href={`mailto:${contact.email}`}
                  size="small"
                  aria-label="Email"
                  sx={{
                    border: `1px solid ${colors.border}`,
                    color: colors.textDark,
                    "&:hover": {
                      color: colors.primary,
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <EmailIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Box>

          {/* Column 2: Quick Links */}
          <Box>
            <Typography sx={footerHeadingSx}>Quick Links</Typography>

            <Box component="a" href="#about" sx={footerLinkSx}>
              About
            </Box>

            <Box component="a" href="#programs" sx={footerLinkSx}>
              Programs
            </Box>

            <Box component="a" href="#services" sx={footerLinkSx}>
              Services
            </Box>

            <Box component="a" href="#testimonials" sx={footerLinkSx}>
              Success Stories
            </Box>

            <Box component="a" href="#health-tools" sx={footerLinkSx}>
              Health Tools
            </Box>

            <Box component="a" href="#faq" sx={footerLinkSx}>
              FAQ
            </Box>

            <Box component="a" href="#contact" sx={footerLinkSx}>
              Contact
            </Box>
          </Box>

          {/* Column 3: Services */}
          <Box>
            <Typography sx={footerHeadingSx}>Services</Typography>

            <Box component="a" href="#services" sx={footerLinkSx}>
              1:1 Nutrition Coaching
            </Box>

            <Box component="a" href="#services" sx={footerLinkSx}>
              Weight Management
            </Box>

            <Box component="a" href="#services" sx={footerLinkSx}>
              PCOS &amp; Hormonal Care
            </Box>

            <Box component="a" href="#services" sx={footerLinkSx}>
              Diabetes &amp; Metabolic Care
            </Box>

            <Box component="a" href="#services" sx={footerLinkSx}>
              Custom Meal Planning
            </Box>
          </Box>

          {/* Column 4: Contact */}
          <Box>
            <Typography sx={footerHeadingSx}>Contact</Typography>

            {contact?.email && (
              <Box
                component="a"
                href={`mailto:${contact.email}`}
                sx={{
                  ...footerLinkSx,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  wordBreak: "break-word",
                }}
              >
                <EmailIcon sx={{ fontSize: "1.1rem", color: colors.primary }} />
                <span>{contact.email}</span>
              </Box>
            )}

            {contact?.phone && (
              <Box
                component="a"
                href={`tel:${contact.phone}`}
                sx={{
                  ...footerLinkSx,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                <PhoneIcon sx={{ fontSize: "1.1rem", color: colors.primary }} />
                <span>{contact.phone}</span>
              </Box>
            )}

            {contact?.instagramUrl && (
              <Box
                component="a"
                href={contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                sx={{
                  ...footerLinkSx,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                <InstagramIcon
                  sx={{ fontSize: "1.1rem", color: colors.primary }}
                />
                <span>Instagram</span>
              </Box>
            )}

            {contact?.whatsappNumber && (
              <Box
                component="a"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                sx={{
                  ...footerLinkSx,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                <WhatsAppIcon
                  sx={{ fontSize: "1.1rem", color: colors.primary }}
                />
                <span>WhatsApp</span>
              </Box>
            )}

            <Box
              sx={{
                ...footerLinkSx,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
              }}
            >
              <LocationOnIcon
                sx={{ fontSize: "1.1rem", color: colors.primary }}
              />
              <span>Online Consultations Available Pan-India</span>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                onClick={openBooking}
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: colors.primary,
                  color: colors.white,
                  borderRadius: 50,
                  py: 1.1,
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  "&:hover": {
                    bgcolor: colors.primaryDark,
                  },
                }}
              >
                Book a Free Call
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            borderTop: `1px solid ${colors.border}`,
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            fontSize: "0.82rem",
            color: colors.textLight,
          }}
        >
          <Typography sx={{ fontSize: "inherit", color: "inherit" }}>
            Nutrition with Ruchika | Nutritionist &amp; Dietitian ©{" "}
            {new Date().getFullYear()}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 3 },
              flexWrap: "wrap",
            }}
          >
            <Box
              component="a"
              href="/privacy-policy"
              sx={{
                color: colors.textLight,
                textDecoration: "none",
                "&:hover": {
                  color: colors.primary,
                },
              }}
            >
              Privacy Policy
            </Box>

            <Box
              component="a"
              href="/disclaimer"
              sx={{
                color: colors.textLight,
                textDecoration: "none",
                "&:hover": {
                  color: colors.primary,
                },
              }}
            >
              Disclaimer
            </Box>

            <Box
              component="a"
              href="/terms-and-conditions"
              sx={{
                color: colors.textLight,
                textDecoration: "none",
                "&:hover": {
                  color: colors.primary,
                },
              }}
            >
              Terms &amp; Conditions
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export function WhatsAppFloat() {
  const { contact } = useSiteContent();

  if (!contact?.whatsappNumber) {
    return null;
  }

  const whatsappLink = `https://wa.me/${String(contact.whatsappNumber).replace(
    /\D/g,
    "",
  )}`;

  return (
    <Fab
      component="a"
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      sx={{
        position: "fixed",
        bottom: { xs: 18, sm: 28 },
        right: { xs: 18, sm: 28 },
        bgcolor: colors.whatsapp,
        color: colors.white,
        width: { xs: 56, sm: 58 },
        height: { xs: 56, sm: 58 },
        boxShadow: "0 8px 24px rgba(37,211,102,0.35)",
        zIndex: 1000,
        transition: "transform 0.2s ease, background-color 0.2s ease",
        "&:hover": {
          bgcolor: "#1fb356",
          transform: "scale(1.06)",
        },
      }}
    >
      <WhatsAppIcon sx={{ fontSize: "1.7rem" }} />
    </Fab>
  );
}

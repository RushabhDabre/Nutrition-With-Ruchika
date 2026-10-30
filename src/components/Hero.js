import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Dialog,
  IconButton,
  Skeleton,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { colors } from "../theme";
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

const clinicalPillars = [
  { icon: "🔬", label: "M.Pharm Pharmacology", sub: "Clinical Biochemical Science" },
  { icon: "🍲", label: "100% Ghar Ka Khana", sub: "Zero Powders or Starvation" },
  { icon: "🌸", label: "PCOS & Gut Reversal", sub: "Targeted Hormonal Protocols" },
  { icon: "📊", label: "Lab Report Analysis", sub: "Root-Cause Biomarker Tracking" },
  { icon: "💬", label: "Daily WhatsApp Mentorship", sub: "Continuous 1:1 Accountability" },
];

export default function Hero({ topOffset = 80 }) {
  const { openBooking } = useBooking();
  const { hero } = useSiteContent();
  const [videoOpen, setVideoOpen] = useState(false);
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);

  const youtubeId = extractYouTubeId(hero?.videoUrl);

  return (
    <Box
      id="home"
      sx={{
        bgcolor: colors.bgCream,
        minHeight: { xs: "auto", md: "100vh" },
        display: "flex",
        flexDirection: "column",
        pt: {
          xs: `${topOffset + 4}px`,
          md: `${topOffset + 6}px`,
        },
        "@keyframes heroFadeUp": {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes heroFadeScale": {
          "0%": { opacity: 0, transform: "scale(1.04)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "@keyframes gentleFloat": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "@media (prefers-reduced-motion: reduce)": {
          "& *": {
            animation: "none !important",
            transition: "none !important",
          },
        },
      }}
    >
      {/* Upper Hero Grid - Proportional, clean, no awkward blank voids */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          py: { xs: 1, md: 1.5 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.08fr 0.92fr" },
              gap: { xs: 2.5, md: 4 },
              alignItems: "center",
            }}
          >
            {/* Left Column: Heading, Subhead & Actions */}
            <Box>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "1.95rem", sm: "2.35rem", md: "2.75rem", lg: "2.95rem" },
                  fontWeight: 700,
                  color: colors.textDark,
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  mb: 1.25,
                  animation: "heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards",
                }}
              >
                Find Your <br />
                <Box component="span" sx={{ color: colors.primaryDark, fontWeight: 800 }}>
                  Healthy Balance
                </Box>{" "}
                with Us
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "0.86rem", md: "0.93rem" },
                  color: colors.textMuted,
                  lineHeight: 1.55,
                  mb: 2,
                  maxWidth: 450,
                  animation: "heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.22s backwards",
                }}
              >
                Personalized, science-backed nutrition plans designed to help you
                reach your goals sustainably. From clinical PCOS and gut care to
                everyday home meals — we guide you every step of the way.
              </Typography>

              {/* CTAs */}
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  mb: 2,
                  animation: "heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.34s backwards",
                }}
              >
                <Button
                  onClick={openBooking}
                  variant="contained"
                  sx={{
                    bgcolor: colors.primaryDark,
                    color: "#ffffff",
                    px: 3.2,
                    py: 1.15,
                    borderRadius: "28px",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    boxShadow: "0 6px 18px rgba(56, 75, 50, 0.22)",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      bgcolor: colors.darkGreenHover,
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 24px rgba(56, 75, 50, 0.35)",
                    },
                  }}
                >
                  Book Consultation
                </Button>

                <Button
                  onClick={() => setVideoOpen(true)}
                  variant="text"
                  startIcon={
                    <Box
                      className="play-icon-box"
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        border: `1.5px solid ${colors.primaryDark}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: 17, color: colors.primaryDark }} />
                    </Box>
                  }
                  sx={{
                    color: colors.textDark,
                    fontWeight: 500,
                    fontSize: "0.86rem",
                    px: 1.25,
                    "&:hover": {
                      bgcolor: "transparent",
                      opacity: 0.85,
                      "& .play-icon-box": {
                        transform: "scale(1.1)",
                        boxShadow: "0 0 0 6px rgba(56, 75, 50, 0.14)",
                      },
                    },
                  }}
                >
                  Watch My Story
                </Button>
              </Stack>

              {/* Avatars & Social Proof */}
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  animation: "heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.46s backwards",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="img"
                    src="/assets/images/profilePhoto.jpg"
                    alt="Client"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "2px solid #ffffff",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      ml: -1.1,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: colors.primaryDark,
                      color: "#ffffff",
                      border: "2px solid #ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.66rem",
                      fontWeight: 700,
                    }}
                  >
                    500+
                  </Box>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: colors.textDark,
                      lineHeight: 1.2,
                    }}
                  >
                    500+ Happy Clients
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.74rem", color: colors.textLight }}
                  >
                    4.9★ verified Google & intake rating
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Right Column: Full-width natural image with left opacity slope (NO BOX, NO BORDER) */}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { xs: 360, sm: 440, md: 490, lg: 530 },
                  animation: "heroFadeScale 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.15s backwards",
                  maskImage: {
                    xs: "none",
                    md: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.4) 22%, rgba(0,0,0,0.85) 38%, #000000 55%)",
                  },
                  WebkitMaskImage: {
                    xs: "none",
                    md: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.4) 22%, rgba(0,0,0,0.85) 38%, #000000 55%)",
                  },
                }}
              >
                {!heroImgLoaded && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bgcolor: "rgba(56, 75, 50, 0.05)",
                      borderRadius: { xs: "20px", md: 0 },
                    }}
                  />
                )}
                <Box
                  component="img"
                  src="/assets/images/Hero.jpg"
                  alt="Dietitian Ruchika Shanware"
                  onLoad={() => setHeroImgLoaded(true)}
                  sx={{
                    width: "100%",
                    height: { xs: 300, sm: 350, md: 390, lg: 420 },
                    objectFit: "cover",
                    objectPosition: "center 15%",
                    display: "block",
                    borderRadius: { xs: "20px", md: 0 },
                    opacity: heroImgLoaded ? 1 : 0,
                    transition: "opacity 0.4s ease-in-out",
                  }}
                />

                {/* Secondary gradient overlay for perfect seamless blending into background */}
                <Box
                  sx={{
                    display: { xs: "none", md: "block" },
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: "45%",
                    background: `linear-gradient(to right, ${colors.bgCream} 0%, rgba(251, 251, 247, 0.75) 30%, transparent 100%)`,
                    pointerEvents: "none",
                  }}
                />
              </Box>

              {/* Floating Bottom Badge - Gentle Organic Floating & Interactive Lift */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: 8, md: 10 },
                  left: { xs: 12, md: 20 },
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "16px",
                  px: 1.5,
                  py: 0.6,
                  boxShadow:
                    "0 10px 24px -4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  zIndex: 2,
                  animation:
                    "heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s backwards, gentleFloat 5s ease-in-out 1.35s infinite",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  cursor: "default",
                  "&:hover": {
                    transform: "translateY(-6px) scale(1.02)",
                    boxShadow:
                      "0 14px 28px -4px rgba(0, 0, 0, 0.14), 0 6px 12px rgba(56, 75, 50, 0.08)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "0.95rem" }}>🌿</Typography>
                <Box>
                  <Typography sx={{ fontSize: "0.74rem", fontWeight: 700, color: colors.textDark, lineHeight: 1.15 }}>
                    Certified Clinical Dietitian
                  </Typography>
                  <Typography sx={{ fontSize: "0.64rem", color: colors.textLight }}>
                    M.Pharm Pharmacology
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* THE SLICK GREEN CURVE BAND (Yogabn Style) */}
      <Box
        sx={{
          position: "relative",
          bgcolor: colors.darkGreen,
          color: "#ffffff",
          pt: { xs: 2.2, md: 2.8 },
          pb: { xs: 2, md: 2.4 },
        }}
      >
        {/* SVG Wave Curve Transition at Top */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: -14, md: -20 },
            left: 0,
            right: 0,
            width: "100%",
            overflow: "hidden",
            lineHeight: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "24px", display: "block" }}
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C380,6 1060,6 1440,40 L1440,40 L0,40 Z"
              fill={colors.darkGreen}
            />
          </svg>
        </Box>

        <Container maxWidth="lg" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.85)",
              mb: 1.25,
            }}
          >
            OUR CLINICAL STANDARDS · ROOTED IN SCIENCE · REAL SUSTAINABILITY
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: { xs: 0.85, md: 1.25 },
            }}
          >
            {clinicalPillars.map((p, idx) => (
              <Box
                key={idx}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.12)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  px: 1.75,
                  py: 0.6,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.85,
                  backdropFilter: "blur(8px)",
                  transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.22)",
                    transform: "translateY(-3px) scale(1.02)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "0.95rem", lineHeight: 1 }}>{p.icon}</Typography>
                <Box sx={{ textAlign: "left" }}>
                  <Typography sx={{ fontSize: "0.76rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.15 }}>
                    {p.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.64rem", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.15 }}>
                    {p.sub}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Sleek Down Forward Arrow at base of green curve */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1.25,
            }}
          >
            <Box
              component="a"
              href="#benefits"
              aria-label="Scroll to next section"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(2px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "rgba(255, 255, 255, 0.18)",
                  border: "1.5px solid rgba(255, 255, 255, 0.35)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  animation: "bounceDownArrow 2.2s ease-in-out infinite, pulseGlow 2.2s ease-in-out infinite",
                  "@keyframes bounceDownArrow": {
                    "0%, 100%": {
                      transform: "translateY(0)",
                    },
                    "50%": {
                      transform: "translateY(5px)",
                    },
                  },
                  "@keyframes pulseGlow": {
                    "0%, 100%": {
                      boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.4)",
                    },
                    "50%": {
                      boxShadow: "0 0 0 8px rgba(255, 255, 255, 0)",
                    },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Video Modal */}
      <Dialog
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "18px", overflow: "hidden", bgcolor: "#000" },
        }}
      >
        <Box sx={{ position: "relative", pt: "56.25%" }}>
          <IconButton
            onClick={() => setVideoOpen(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#fff",
              zIndex: 10,
              "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
            }}
          >
            <CloseIcon />
          </IconButton>
          {youtubeId ? (
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title="Introduction"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          ) : (
            <Box
              component="video"
              src={hero?.videoUrl}
              autoPlay
              controls
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

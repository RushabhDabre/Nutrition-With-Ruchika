import React from "react";
import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { colors } from "../theme";
import { useBooking } from "../context/BookingContext";
import RevealOnScroll from "./RevealOnScroll";

const benefits = [
  {
    icon: "🥗",
    title: "Improve Metabolism",
    desc: "Enhance metabolic flexibility and burn fat effectively using everyday home-cooked meals.",
  },
  {
    icon: "🧘",
    title: "Reduce Stress & Cravings",
    desc: "Balance cortisol and insulin levels to eliminate late-night sugar cravings and energy crashes.",
  },
  {
    icon: "🌸",
    title: "Hormonal Balance",
    desc: "Targeted clinical protocols for regular menstrual cycles, PCOS management, and thyroid support.",
  },
  {
    icon: "🥑",
    title: "Heal Gut Health",
    desc: "Restore your gut microbiome to banish chronic bloating, acidity, and digestive discomfort.",
  },
];

export default function ValuePillars() {
  const { openBooking } = useBooking();

  return (
    <Box
      component="section"
      id="benefits"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: colors.bgCream,
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header with Arrow Navigation (Yogabn Style) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: { xs: 3.5, md: 4.5 },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.primaryDark,
                mb: 0.75,
              }}
            >
              BENEFITS
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.2rem" },
                fontWeight: 700,
                color: colors.textDark,
                letterSpacing: "-0.01em",
              }}
            >
              Your Nutrition Journey Benefits
            </Typography>
          </Box>

          {/* Minimalist < > Arrow Controls */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
            <IconButton
              size="small"
              sx={{
                border: `1px solid ${colors.border}`,
                bgcolor: colors.bgWhite,
                width: 36,
                height: 36,
                "&:hover": { bgcolor: colors.bgSage },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 13, color: colors.textDark }} />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                border: `1px solid ${colors.border}`,
                bgcolor: colors.bgWhite,
                width: 36,
                height: 36,
                "&:hover": { bgcolor: colors.bgSage },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 13, color: colors.textDark }} />
            </IconButton>
          </Box>
        </Box>

        {/* 4 Cards Grid with Organic Petal Shape Icons */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2.5,
            mb: 4.5,
          }}
        >
          {benefits.map((b, i) => (
            <RevealOnScroll key={i} delay={i * 0.1} variant="fade-up" sx={{ height: "100%" }}>
              <Box
                sx={{
                  bgcolor: colors.bgWhite,
                  p: { xs: 3, sm: 3.5 },
                  borderRadius: "20px",
                  border: `1px solid ${colors.border}`,
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  height: "100%",
                  transition:
                    "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-7px)",
                    borderColor: "rgba(56, 75, 50, 0.28)",
                    boxShadow:
                      "0 16px 32px -4px rgba(40, 56, 38, 0.09), 0 6px 14px rgba(0, 0, 0, 0.03)",
                    "& .benefit-icon-frame": {
                      transform: "scale(1.14) rotate(6deg)",
                      bgcolor: "rgba(56, 75, 50, 0.12)",
                    },
                  },
                }}
              >
                {/* Petal/Organic Rounded Icon Frame */}
                <Box
                  className="benefit-icon-frame"
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "16px",
                    bgcolor: colors.primarySubtle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                    mb: 2.5,
                    transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease",
                  }}
                >
                  {b.icon}
                </Box>

                <Typography
                  sx={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: colors.textDark,
                    mb: 1,
                    lineHeight: 1.3,
                  }}
                >
                  {b.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: colors.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  {b.desc}
                </Typography>
              </Box>
            </RevealOnScroll>
          ))}
        </Box>

        {/* Centered Button (Yogabn Style) */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            onClick={openBooking}
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: "0.95rem" }} />}
            sx={{
              bgcolor: colors.primaryDark,
              color: "#ffffff",
              borderRadius: "28px",
              px: 3.5,
              py: 1.15,
              fontSize: "0.86rem",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(56, 75, 50, 0.2)",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              "&:hover": {
                bgcolor: colors.darkGreenHover,
                transform: "translateY(-2px)",
                boxShadow: "0 8px 22px rgba(56, 75, 50, 0.32)",
                "& .MuiButton-endIcon": {
                  transform: "translateX(4px)",
                },
              },
              "& .MuiButton-endIcon": {
                transition: "transform 0.2s ease",
              },
            }}
          >
            Start Your Journey
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

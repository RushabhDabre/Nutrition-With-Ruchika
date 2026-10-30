import React from "react";
import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import CallMadeIcon from "@mui/icons-material/CallMade";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpaIcon from "@mui/icons-material/Spa";
import { colors } from "../theme";
import { useBooking } from "../context/BookingContext";
import RevealOnScroll from "./RevealOnScroll";

const PROGRAMS = [
  {
    id: "p1",
    level: "Starter",
    title: "1-on-1 Consultation & Audit",
    duration: "45-60 Mins",
    intensity: "Health Deep Dive",
    desc: "Comprehensive analysis of your medical history, blood reports, diet recall, and a personalized 7-day starter plan.",
    icon: "🥗",
    bgColor: "#E9F0E6",
  },
  {
    id: "p2",
    level: "Most Popular",
    title: "100-Day Lifestyle Transformation",
    duration: "100 Days",
    intensity: "Complete Care",
    desc: "Complete metabolic reset, progressive meal plans updated every 2 weeks, weekly reviews, and daily WhatsApp support.",
    icon: "🌱",
    bgColor: "#E4EDE0",
  },
  {
    id: "p3",
    level: "Hormone Care",
    title: "PCOS & Hormonal Healing",
    duration: "90 Days",
    intensity: "Clinical Protocol",
    desc: "Targeted protocol to lower androgen excess, restore ovulation and regular cycles, clear cystic acne, and boost energy.",
    icon: "🌸",
    bgColor: "#F3ECE8",
  },
  {
    id: "p4",
    level: "Therapeutic",
    title: "Gut Reset & Microbiome Repair",
    duration: "60 Days",
    intensity: "Digestive Relief",
    desc: "Evidence-based elimination and rebuilding protocol to eliminate chronic bloating, IBS, acid reflux, and constipation.",
    icon: "🥑",
    bgColor: "#E8EFEA",
  },
];

export function KeyServicesStrip() {
  const { openBooking } = useBooking();

  return (
    <Box
      component="section"
      id="programs"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: colors.bgCream,
      }}
    >
      <Container maxWidth="lg">
        {/* Header with Title and "View All" link */}
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
              POPULAR PROGRAMS
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
              Structured Clinical Care
            </Typography>
          </Box>

          <Box
            component="button"
            onClick={openBooking}
            sx={{
              background: "none",
              border: `1px solid ${colors.border}`,
              borderRadius: "20px",
              px: 2,
              py: 0.6,
              fontSize: "0.82rem",
              fontWeight: 600,
              color: colors.textDark,
              cursor: "pointer",
              display: { xs: "none", sm: "inline-block" },
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: colors.bgWhite,
                borderColor: colors.primaryDark,
              },
            }}
          >
            View All Programs
          </Box>
        </Box>

        {/* 4 Cards Grid (Desktop: 4 columns, Mobile: sleek stack) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {PROGRAMS.map((prog, idx) => (
            <RevealOnScroll key={prog.id} delay={idx * 0.1} variant="fade-up" sx={{ height: "100%" }}>
              <Card
                onClick={openBooking}
                sx={{
                  bgcolor: colors.bgWhite,
                  borderRadius: "20px",
                  border: `1px solid ${colors.border}`,
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition:
                    "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "rgba(56, 75, 50, 0.3)",
                    boxShadow:
                      "0 18px 36px -4px rgba(40, 56, 38, 0.1), 0 8px 16px rgba(0, 0, 0, 0.04)",
                    "& .service-arrow-box": {
                      bgcolor: colors.primaryDark,
                      transform: "rotate(45deg) scale(1.1)",
                      boxShadow: "0 4px 12px rgba(56, 75, 50, 0.3)",
                    },
                    "& .service-arrow-box .MuiSvgIcon-root": {
                      color: "#ffffff",
                    },
                    "& .service-emoji": {
                      transform: "scale(1.15)",
                    },
                  },
                }}
              >
                {/* Card Visual Banner with Badge & Arrow */}
                <Box
                  sx={{
                    bgcolor: prog.bgColor,
                    height: 150,
                    position: "relative",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Level Pill Top Left */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(4px)",
                      borderRadius: "14px",
                      px: 1.25,
                      py: 0.35,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: colors.primaryDark,
                    }}
                  >
                    {prog.level}
                  </Box>

                  {/* Arrow Icon Top Right */}
                  <Box
                    className="service-arrow-box"
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.primaryDark,
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    <CallMadeIcon sx={{ fontSize: 15, color: colors.primaryDark, transition: "color 0.2s ease" }} />
                  </Box>

                  {/* Big Center Icon */}
                  <Typography
                    className="service-emoji"
                    sx={{
                      fontSize: "3.2rem",
                      lineHeight: 1,
                      transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    {prog.icon}
                  </Typography>
                </Box>

                {/* Card Content */}
                <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    color: colors.textDark,
                    lineHeight: 1.3,
                    mb: 1,
                  }}
                >
                  {prog.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.82rem",
                    color: colors.textMuted,
                    lineHeight: 1.55,
                    mb: 2,
                    flexGrow: 1,
                  }}
                >
                  {prog.desc}
                </Typography>

                {/* Metadata Row: Duration & Intensity */}
                <Box
                  sx={{
                    pt: 1.5,
                    borderTop: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: colors.textLight,
                    fontSize: "0.75rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: colors.primaryDark }} />
                    <span>{prog.duration}</span>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SpaIcon sx={{ fontSize: 14, color: colors.primary }} />
                    <span>{prog.intensity}</span>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            </RevealOnScroll>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export function WhyChooseMe() {
  return null;
}

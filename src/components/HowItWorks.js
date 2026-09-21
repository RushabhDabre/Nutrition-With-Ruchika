import React from "react";
import { Box, Container, Typography } from "@mui/material";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { colors, serifFont } from "../theme";
import SectionTitle from "./SectionTitle";

const steps = [
  {
    icon: <PhoneInTalkIcon sx={{ fontSize: "1.7rem" }} />,
    title: "Consultation Call",
    text: "Book your slot and hop on a call — we discuss your goals, health history, and lifestyle in detail.",
  },
  {
    icon: <FactCheckIcon sx={{ fontSize: "1.7rem" }} />,
    title: "Pick the Right Program",
    text: "Based on the call, I recommend the program that actually fits your goals and routine — no pressure.",
  },
  {
    icon: <RestaurantMenuIcon sx={{ fontSize: "1.7rem" }} />,
    title: "Personalized Plan Starts",
    text: "Your custom diet plan is built around regular ghar ka khana, with regular check-ins to keep you on track.",
  },
];

export default function HowItWorks() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: colors.bgLight,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="How It Works"
          title="What Happens After You Book"
          subtitle="A simple, transparent 3-step process from your first call to your customized nutrition plan"
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 5, md: 4 },
            position: "relative",
          }}
        >
          {/* Connecting line - desktop only */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 32,
              left: "16.5%",
              right: "16.5%",
              height: 2,
              background: colors.border,
              zIndex: 0,
            }}
          />

          {steps.map((step, i) => (
            <Box
              key={step.title}
              sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  mx: "auto",
                  mb: 2.5,
                  bgcolor: colors.primary,
                  color: colors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(121, 152, 91, 0.28)",
                }}
              >
                {step.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: colors.primary,
                  mb: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Step {i + 1}
              </Typography>
              <Typography
                sx={{
                  fontFamily: serifFont,
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: colors.textDark,
                  mb: 1.25,
                }}
              >
                {step.title}
              </Typography>
              <Typography
                sx={{
                  color: colors.textLight,
                  fontSize: "0.92rem",
                  lineHeight: 1.7,
                  maxWidth: 290,
                  mx: "auto",
                }}
              >
                {step.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

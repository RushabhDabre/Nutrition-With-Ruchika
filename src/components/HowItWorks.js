import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { colors } from "../theme";
import SectionTitle from "./SectionTitle";
import RevealOnScroll from "./RevealOnScroll";

const steps = [
  {
    num: "01",
    title: "1-on-1 Consultation Call",
    text: "Select your preferred slot and join a 45-60 min deep-dive call to discuss your health history, blood markers, and goals.",
  },
  {
    num: "02",
    title: "Customized Food Roadmap",
    text: "Receive your tailored meal plan crafted strictly around your routine, regional food habits, and metabolic requirements.",
  },
  {
    num: "03",
    title: "Daily Support & Weekly Review",
    text: "Stay accountable with daily WhatsApp meal checks, weekend progress reviews, and continuous adjustments for lasting results.",
  },
];

export default function HowItWorks() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: colors.bgCream }}>
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="PROCESS"
          title="How It Works"
          subtitle="Three clear, simple steps from your first call to lasting health"
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {steps.map((step, idx) => (
            <RevealOnScroll key={step.num} delay={idx * 0.14} variant="fade-up" sx={{ height: "100%" }}>
              <Box
                sx={{
                  bgcolor: colors.bgWhite,
                  p: { xs: 3, sm: 4 },
                  borderRadius: "18px",
                  border: `1px solid ${colors.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  height: "100%",
                  transition:
                    "transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-7px)",
                    borderColor: "rgba(56, 75, 50, 0.28)",
                    boxShadow:
                      "0 16px 32px -4px rgba(40, 56, 38, 0.09), 0 6px 14px rgba(0,0,0,0.03)",
                    "& .step-number": {
                      color: colors.primaryDark,
                      transform: "scale(1.08)",
                    },
                  },
                }}
              >
                <Typography
                  className="step-number"
                  sx={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: colors.primaryLight,
                    lineHeight: 1,
                    mb: 2,
                    display: "inline-block",
                    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease",
                  }}
                >
                  {step.num}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.08rem",
                    fontWeight: 700,
                    color: colors.textDark,
                    mb: 1.25,
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  sx={{
                    color: colors.textMuted,
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                  }}
                >
                  {step.text}
                </Typography>
              </Box>
            </RevealOnScroll>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

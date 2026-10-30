import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { colors } from "../theme";
import { useBooking } from "../context/BookingContext";

export default function About() {
  const { openBooking } = useBooking();

  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: colors.bgCream,
      }}
    >
      <Container maxWidth="lg">
        {/* Big Yogabn Centerpiece Card */}
        <Box
          sx={{
            bgcolor: colors.darkGreen,
            borderRadius: { xs: "24px", md: "32px" },
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            color: "#ffffff",
            boxShadow: "0 14px 40px rgba(40, 56, 38, 0.15)",
          }}
        >
          {/* Left Column: Narrative & Checklist */}
          <Box
            sx={{
              p: { xs: 3.5, sm: 5, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.75)",
                mb: 1.25,
              }}
            >
              MEET YOUR NUTRITIONIST
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.65rem", sm: "2rem", md: "2.35rem" },
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.22,
                letterSpacing: "-0.01em",
                mb: 2,
              }}
            >
              Rooted in Pharmacology. <br />
              Tailored to Your Kitchen.
            </Typography>

            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.82)",
                fontSize: "0.92rem",
                lineHeight: 1.68,
                mb: 3,
                maxWidth: 480,
              }}
            >
              I'm Ruchika Shanware, a Certified Clinical Nutritionist with a
              Master's in Pharmacology and 7+ years in healthcare. I combine
              medical biochemical understanding with real, sustainable Indian home
              cooking.
            </Typography>

            {/* Checklist items */}
            <Stack spacing={1.5} sx={{ mb: 4 }}>
              {[
                "Targeted medical protocols for PCOS, thyroid & gut health",
                "100% everyday ghar ka khana — zero artificial powders",
                "Plans formulated around your blood markers & lifestyle",
                "Direct WhatsApp support and weekly progress accountability",
              ].map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "translateX(5px)" },
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ color: "#B6D6AF", fontSize: "1.1rem", flexShrink: 0 }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Box>
              <Button
                onClick={openBooking}
                variant="contained"
                endIcon={<ArrowForwardIcon sx={{ fontSize: "0.95rem" }} />}
                sx={{
                  bgcolor: "#ffffff",
                  color: colors.darkGreen,
                  px: 3.5,
                  py: 1.25,
                  borderRadius: "28px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  "&:hover": {
                    bgcolor: colors.bgCream,
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 22px rgba(0, 0, 0, 0.2)",
                    "& .MuiButton-endIcon": {
                      transform: "translateX(4px)",
                    },
                  },
                  "& .MuiButton-endIcon": {
                    transition: "transform 0.2s ease",
                  },
                }}
              >
                Book a Consultation
              </Button>
            </Box>
          </Box>

          {/* Right Column: Clean Clinic / Nutritionist Portrait with gentle zoom */}
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 300, sm: 360, md: "100%" },
              bgcolor: "rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src="/assets/images/profilePhoto.jpg"
              alt="Ruchika Shanware"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  transform: "scale(1.04)",
                },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

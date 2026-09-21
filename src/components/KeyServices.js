import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { colors, serifFont } from "../theme";
import SectionTitle from "./SectionTitle";
import { apiBaseUrl } from "../data/siteData";
import { useBooking } from "../context/BookingContext";

/* ─────────────────────────────────────────────────────────
 *  KeyServicesStrip  –  "Programs" split-layout section
 *  Fetches from /api/help-areas (fields: id, icon, name,
 *  active, displayOrder) and renders the NOURISH-style
 *  two-column layout: heading + CTA on the left, dynamic
 *  service cards on the right.
 * ───────────────────────────────────────────────────────── */
export function KeyServicesStrip() {
  const [keyServices, setKeyServices] = React.useState([]);
  const { openBooking } = useBooking();

  React.useEffect(() => {
    fetch(`${apiBaseUrl}/api/help-areas`)
      .then((res) => res.json())
      .then(setKeyServices)
      .catch(() => setKeyServices([]));
  }, []);

  const activeItems = keyServices
    ?.filter((item) => item.active)
    ?.sort((a, b) => a.displayOrder - b.displayOrder);

  if (!activeItems || activeItems.length === 0) return null;

  return (
    <Box
      component="section"
      id="programs"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "340px 1fr" },
            gap: { xs: 5, lg: 7 },
            alignItems: "start",
          }}
        >
          {/* ── Left Column: Heading & CTA ── */}
          <Box sx={{ pr: { lg: 2 } }}>
            <Typography
              sx={{
                color: colors.primary,
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                mb: 1.75,
              }}
            >
              Programs
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontFamily: serifFont,
                fontSize: { xs: "2.1rem", md: "2.6rem" },
                fontWeight: 600,
                lineHeight: 1.18,
                color: colors.textDark,
                mb: 2.5,
              }}
            >
              Find the Right Program for Your Goals
            </Typography>

            <Typography
              sx={{
                color: colors.textLight,
                fontSize: "0.95rem",
                lineHeight: 1.75,
                mb: 4,
              }}
            >
              Whether you want to lose weight, build energy, or improve your
              relationship with food, I have a program designed for you.
            </Typography>

            <Button
              onClick={openBooking}
              variant="contained"
              sx={{
                bgcolor: colors.primary,
                color: colors.white,
                py: 1.3,
                px: 3.5,
                borderRadius: 50,
                fontSize: "0.92rem",
                fontWeight: 600,
                "&:hover": { bgcolor: colors.primaryDark },
              }}
            >
              View All Programs
            </Button>
          </Box>

          {/* ── Right Column: Dynamic Service Cards ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: `repeat(${Math.min(activeItems.length, 3)}, 1fr)`,
              },
              gap: 3,
            }}
          >
            {activeItems.map((s) => (
              <Card
                key={s.id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.white,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 36px rgba(121, 152, 91, 0.12)",
                    borderColor: colors.primary,
                  },
                }}
              >
                {/* Icon header area */}
                <Box
                  sx={{
                    bgcolor: "rgba(121, 152, 91, 0.08)",
                    py: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <Typography sx={{ fontSize: "3rem", lineHeight: 1 }}>
                    {s.icon}
                  </Typography>
                </Box>

                <CardContent
                  sx={{
                    p: 2.75,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: serifFont,
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      color: colors.textDark,
                      mb: 2,
                    }}
                  >
                    {s.name}
                  </Typography>

                  <Button
                    onClick={openBooking}
                    variant="text"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: "0.95rem" }} />}
                    sx={{
                      alignSelf: "flex-start",
                      p: 0,
                      mt: "auto",
                      color: colors.textDark,
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      "&:hover": {
                        bgcolor: "transparent",
                        color: colors.primary,
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

/* ─────────────────────────────────────────────────────────
 *  WhyChooseMe  –  fetches /api/why-choose-me
 * ───────────────────────────────────────────────────────── */
export function WhyChooseMe() {
  const [whyMe, setWhyMe] = React.useState([]);

  React.useEffect(() => {
    fetch(`${apiBaseUrl}/api/why-choose-me`)
      .then((res) => res.json())
      .then(setWhyMe)
      .catch(() => setWhyMe([]));
  }, []);

  if (!whyMe || whyMe.length === 0) return null;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: colors.bgLight,
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="Why Ruchika"
          title="Why Choose Nutrition with Ruchika"
          subtitle="A personalized approach built on science, not fads"
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 3.5,
          }}
        >
          {whyMe
            ?.filter((item) => item.active)
            ?.sort((a, b) => a.displayOrder - b.displayOrder)
            ?.map((w) => (
              <Card
                key={w.id}
                sx={{
                  bgcolor: colors.white,
                  p: 1.5,
                  borderRadius: 4,
                  border: `1px solid ${colors.border}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: colors.primary,
                    boxShadow: "0 14px 30px rgba(121, 152, 91, 0.12)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      bgcolor: "rgba(121, 152, 91, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.primary,
                      fontSize: "1.4rem",
                      mb: 2,
                    }}
                  >
                    {w.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      fontFamily: serifFont,
                      color: colors.textDark,
                      mb: 1,
                    }}
                  >
                    {w.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.textLight,
                      fontSize: "0.92rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {w.text}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Container>
    </Box>
  );
}

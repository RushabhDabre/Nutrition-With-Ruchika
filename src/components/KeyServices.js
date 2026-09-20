import React from "react";
import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { colors, gradientBrand } from "../theme";
import SectionTitle from "./SectionTitle";
import { apiBaseUrl } from "../data/siteData";

export function KeyServicesStrip() {
  const [keyServices, setKeyServices] = React.useState([]);

  React.useEffect(() => {
    fetch(`${apiBaseUrl}/api/help-areas`)
      .then((res) => res.json())
      .then(setKeyServices)
      .catch(() => setKeyServices([]));
  }, []);

  return (
    <Box component="section" sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="What I Help With"
          title="Key Services"
          subtitle="Personalized nutrition support across the concerns that matter most to you"
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 3,
          }}
        >
          {keyServices
            ?.filter((item) => item.active)
            ?.sort((a, b) => a.displayOrder - b.displayOrder)
            ?.map((s) => (
              <Card
                key={s.id}
                sx={{
                  textAlign: "center",
                  p: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: colors.primary,
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 34px rgba(99,102,241,0.12)",
                  },
                }}
              >
                <CardContent>
                  <Typography sx={{ fontSize: "2.2rem", mb: 1.75 }}>
                    {s.icon}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                    {s.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Container>
    </Box>
  );
}

export function WhyChooseMe() {
  const [whyMe, setWhyMe] = React.useState([]);

  React.useEffect(() => {
    fetch(`${apiBaseUrl}/api/why-choose-me`)
      .then((res) => res.json())
      .then(setWhyMe)
      .catch(() => setWhyMe([]));
  }, []);

  return (
    <Box
      component="section"
      sx={{
        py: 5,
        // bgcolor: colors.bgLight,
        // background: `linear-gradient( 180deg, rgba(245, 246, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="Why Me"
          title="Why Choose Nutrition with Ruchika"
          subtitle="A personalized approach built on science, not fads"
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 3.75,
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
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: colors.primary,
                    boxShadow: "0 16px 34px rgba(99,102,241,0.1)",
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: "12px",
                      background: gradientBrand,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.white,
                      fontSize: "1.5rem",
                      mb: 2.25,
                    }}
                  >
                    {w.icon}
                  </Box>
                  <Typography
                    sx={{ fontSize: "1.2rem", fontWeight: 700, mb: 1.25 }}
                  >
                    {w.title}
                  </Typography>
                  <Typography
                    sx={{ color: colors.textLight, fontSize: "0.95rem" }}
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

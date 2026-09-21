import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { colors, serifFont } from "../theme";
import SectionTitle from "./SectionTitle";
import { apiBaseUrl } from "../data/siteData";

export default function Services() {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    fetch(`${apiBaseUrl}/api/services`)
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <Box
      component="section"
      id="services"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="Specializations"
          title="Areas I Specialize In"
          subtitle="Tailored nutrition programs designed around your clinical and lifestyle needs"
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 3.5,
          }}
        >
          {items
            ?.filter((item) => item.active)
            ?.sort((a, b) => a.displayOrder - b.displayOrder)
            ?.map((s) => (
              <Card
                key={s.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 4,
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.white,
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: colors.primary,
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 36px rgba(121, 152, 91, 0.12)",
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
                      fontSize: "1.5rem",
                      mb: 2,
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: serifFont,
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: colors.textDark,
                      mb: 1.25,
                    }}
                  >
                    {s.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.textLight,
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                      mb: 2.5,
                    }}
                  >
                    {s.text}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                    {s.tags?.split(",").map((tag) => (
                      <Chip
                        key={tag.trim()}
                        label={tag.trim()}
                        size="small"
                        sx={{
                          bgcolor: "rgba(121, 152, 91, 0.08)",
                          color: colors.primaryDark,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderRadius: 50,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Container>
    </Box>
  );
}

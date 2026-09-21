import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { colors, serifFont } from "../theme";
import { apiBaseUrl } from "../data/siteData";

const defaultStories = [
  {
    id: "default-1",
    clientName: "Sarah M.",
    tag: "Lost 25 lbs",
    textContent:
      "Working with Ruchika changed my life. I lost 25 pounds, gained so much energy, and finally feel confident in my own skin without starving.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "default-2",
    clientName: "Michael T.",
    tag: "Gained Energy & Health",
    textContent:
      "The personalized approach made all the difference. I no longer feel deprived and I love the way I feel every day! My lab reports improved dramatically.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "default-3",
    clientName: "Jessica R.",
    tag: "Maintained Results",
    textContent:
      "I've tried so many diets, but this is the first time I've been able to maintain results long-term. Truly life-changing guidance and habit building!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
];

export default function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.filter((item) => item.active !== false));
        } else {
          setItems(defaultStories);
        }
      })
      .catch(() => setItems(defaultStories));
  }, []);

  const displayList = items.length > 0 ? items : defaultStories;

  return (
    <Box
      component="section"
      id="testimonials"
      sx={{
        py: { xs: 9, md: 13 },
        bgcolor: "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        {/* Centered Heading Block */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            sx={{
              color: colors.primary,
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            Success Stories
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontFamily: serifFont,
              fontSize: { xs: "2.2rem", md: "2.8rem" },
              fontWeight: 600,
              color: colors.textDark,
              mb: 1.75,
            }}
          >
            Real People. Real Results.
          </Typography>

          <Typography
            sx={{
              color: colors.textLight,
              fontSize: "1rem",
              maxWidth: 580,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            See how my clients have transformed their health and their lives
            with personalized nutrition coaching.
          </Typography>
        </Box>

        {/* 3 Story Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3.5,
          }}
        >
          {displayList.slice(0, 3).map((t) => (
            <Card
              key={t.id}
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: `1px solid ${colors.border}`,
                bgcolor: colors.white,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: colors.primary,
                  transform: "translateY(-6px)",
                  boxShadow: "0 18px 36px rgba(121, 152, 91, 0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 0, mb: 3 }}>
                {/* Sage Green Quotation Mark */}
                <Box sx={{ color: colors.primary, mb: 2, display: "flex" }}>
                  <FormatQuoteIcon sx={{ fontSize: "2.4rem", transform: "scaleX(-1)" }} />
                </Box>

                <Typography
                  sx={{
                    color: colors.textDark,
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    fontStyle: "normal",
                    fontWeight: 400,
                  }}
                >
                  "{t.textContent}"
                </Typography>

                {t.rating && (
                  <Box sx={{ mt: 2 }}>
                    <Rating value={t.rating} readOnly size="small" sx={{ color: colors.accent }} />
                  </Box>
                )}
              </CardContent>

              {/* Author Footer */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, pt: 2, borderTop: `1px solid ${colors.border}` }}>
                <Avatar
                  src={t.avatar || t.mediaUrl}
                  alt={t.clientName}
                  sx={{
                    width: 46,
                    height: 46,
                    bgcolor: colors.primary,
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {t.clientName?.[0]}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: colors.textDark,
                      lineHeight: 1.3,
                    }}
                  >
                    {t.clientName}
                  </Typography>
                  {t.tag && (
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: colors.textLight,
                        fontWeight: 500,
                      }}
                    >
                      {t.tag}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

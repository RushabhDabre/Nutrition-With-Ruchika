import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "../theme";
import SectionTitle from "./SectionTitle";
import { apiBaseUrl } from "../data/siteData";
import RevealOnScroll from "./RevealOnScroll";

const DEFAULT_REVIEWS = [
  {
    id: "r1",
    clientName: "Aditi Sharma",
    program: "Sustainable Fat Loss · Pune",
    rating: 5,
    textContent:
      "Ruchika helped me lose 11 kg in 3 months without starving or leaving my daily roti and sabzi. My energy levels are at an all-time high! I had tried multiple crash diets before that left me exhausted, but her guidance helped me understand proper portion sizes and meal timing without giving up home food.",
  },
  {
    id: "r2",
    clientName: "Neha Verma",
    program: "PCOS & Hormone Care · Bangalore",
    rating: 5,
    textContent:
      "After 3 years of irregular periods and severe acne, her hormonal balance protocol restored my cycles naturally in 8 weeks. Truly life-changing care. She walked me through every blood report marker, removed inflammatory triggers, and supported me daily on WhatsApp.",
  },
  {
    id: "r3",
    clientName: "Rohan Mehta",
    program: "Gut Health & Digestion · Mumbai",
    rating: 5,
    textContent:
      "Chronic acidity and painful bloating were part of my daily life. Within 3 weeks of following her gut healing plan, all symptoms vanished. Her approach is grounded in real biochemistry and super practical for someone with a busy desk job.",
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/testimonials`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(() => setReviews(DEFAULT_REVIEWS));
  }, []);

  return (
    <Box
      component="section"
      id="testimonials"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: colors.bgCream,
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="REVIEWS"
          title="What Our Clients Say"
          subtitle="Real results from people who chose sustainable, evidence-based nutrition"
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {reviews.slice(0, 3).map((r, i) => (
            <RevealOnScroll key={r.id} delay={i * 0.12} variant="fade-up" sx={{ height: "100%" }}>
              <Card
                sx={{
                  bgcolor: colors.bgWhite,
                  p: { xs: 3, sm: 3.5 },
                  borderRadius: "20px",
                  border: `1px solid ${colors.border}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  transition:
                    "transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-7px)",
                    borderColor: "rgba(56, 75, 50, 0.28)",
                    boxShadow: "0 18px 36px -4px rgba(40, 56, 38, 0.1)",
                    "& .star-icon": {
                      transform: "scale(1.15)",
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  {/* 5 Stars */}
                  <Box sx={{ display: "flex", gap: 0.25, color: colors.warmAccent, mb: 1.75 }}>
                    {[...Array(r.rating || 5)].map((_, idx) => (
                      <StarIcon
                        key={idx}
                        className="star-icon"
                        sx={{ fontSize: "1.05rem", transition: "transform 0.2s ease" }}
                      />
                    ))}
                  </Box>

                {/* Quote with clamped text */}
                <Typography
                  sx={{
                    color: colors.textDark,
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    fontStyle: "italic",
                    mb: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  "{r.textContent || r.text}"
                </Typography>

                {/* Read More button */}
                <Button
                  onClick={() => setSelectedReview(r)}
                  variant="text"
                  sx={{
                    p: 0,
                    minWidth: 0,
                    color: colors.primaryDark,
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    textTransform: "none",
                    mb: 2.5,
                    "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                  }}
                >
                  Read More →
                </Button>

                {/* Client info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pt: 2,
                    borderTop: `1px solid ${colors.border}`,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: colors.bgSage,
                      color: colors.primaryDark,
                      fontWeight: 700,
                      fontSize: "0.92rem",
                    }}
                  >
                    {(r.clientName || r.name || "C").charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: colors.textDark, lineHeight: 1.2 }}>
                      {r.clientName || r.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.74rem", color: colors.textLight }}>
                      {r.program || r.tag}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </RevealOnScroll>
        ))}
        </Box>
      </Container>

      {/* FULL TESTIMONIAL MODAL (Restored with clean styling) */}
      <Dialog
        open={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "20px", p: 1, bgcolor: colors.bgWhite },
        }}
      >
        {selectedReview && (
          <>
            <DialogTitle
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: colors.primaryDark, color: "#fff" }}>
                  {(selectedReview.clientName || selectedReview.name || "C").charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.98rem", color: colors.textDark, lineHeight: 1.2 }}>
                    {selectedReview.clientName || selectedReview.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: colors.primaryLight, fontWeight: 600 }}>
                    {selectedReview.program || selectedReview.tag}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedReview(null)} sx={{ color: colors.textLight }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3, borderColor: colors.border }}>
              {/* Optional Photo or Video */}
              {selectedReview.type === "PHOTO" && selectedReview.mediaUrl && (
                <Box
                  component="img"
                  src={selectedReview.mediaUrl}
                  alt={selectedReview.clientName}
                  sx={{
                    width: "100%",
                    maxHeight: "360px",
                    objectFit: "contain",
                    borderRadius: "14px",
                    mb: 2,
                    display: "block",
                  }}
                />
              )}

              {selectedReview.type === "VIDEO" && selectedReview.mediaUrl && (
                <Box sx={{ width: "100%", maxHeight: "360px", borderRadius: "14px", overflow: "hidden", mb: 2 }}>
                  <video
                    src={selectedReview.mediaUrl}
                    style={{ width: "100%", maxHeight: "360px", objectFit: "contain" }}
                    controls
                    autoPlay
                  />
                </Box>
              )}

              {/* Star rating */}
              <Box sx={{ display: "flex", gap: 0.5, color: colors.warmAccent, mb: 2 }}>
                {[...Array(selectedReview.rating || 5)].map((_, i) => (
                  <StarIcon key={i} sx={{ fontSize: "1.1rem" }} />
                ))}
              </Box>

              {/* Full Text */}
              <Typography
                sx={{
                  color: colors.textDark,
                  fontSize: "0.96rem",
                  lineHeight: 1.75,
                  fontStyle: "italic",
                }}
              >
                "{selectedReview.textContent || selectedReview.text}"
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

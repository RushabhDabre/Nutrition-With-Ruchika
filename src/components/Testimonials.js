import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { colors, gradientBrand } from "../theme";
import { apiBaseUrl } from "../data/siteData";
import SectionTitle from "./SectionTitle";

const CARD_WIDTH = 320; // slightly wider to fit content better
const CARD_GAP = 20;
const AUTO_SCROLL_INTERVAL_MS = 3500;

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [overflowing, setOverflowing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null); // For the modal
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/testimonials`)
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    const check = () => {
      const el = scrollRef.current;
      if (el) setOverflowing(el.scrollWidth > el.clientWidth + 4);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [items]);

  const scrollByAmount = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;

    if (dir > 0 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir < 0 && atStart) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * (CARD_WIDTH + CARD_GAP), behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!overflowing || paused || selectedTestimonial) return undefined;
    intervalRef.current = setInterval(
      () => scrollByAmount(1),
      AUTO_SCROLL_INTERVAL_MS
    );
    return () => clearInterval(intervalRef.current);
  }, [overflowing, paused, scrollByAmount, selectedTestimonial]);

  if (items.length === 0) return null;

  return (
    <Box component="section" id="testimonials" sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="Client Stories"
          title="What Clients Say"
          subtitle="Real results from real people"
        />

        <Box
          sx={{
            position: "relative",
            "&:hover .carousel-arrow": { opacity: 1 },
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <IconButton
            className="carousel-arrow"
            onClick={() => scrollByAmount(-1)}
            sx={{
              position: "absolute",
              left: -20,
              top: "40%",
              zIndex: 2,
              bgcolor: colors.white,
              boxShadow: 2,
              display: { xs: "none", md: "flex" },
              opacity: 0,
              transition: "opacity 0.25s",
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Box>
            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                gap: 2.5,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                pb: 2,
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
            >
              {items.map((t) => (
                <Card
                  key={t.id}
                  sx={{
                    minWidth: CARD_WIDTH,
                    maxWidth: CARD_WIDTH,
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 18px 40px rgba(99,102,241,0.1)",
                      borderColor: colors.primary,
                    },
                  }}
                >
                  {t.type === "PHOTO" && t.mediaUrl && (
                    <Box
                      component="img"
                      src={t.mediaUrl}
                      alt={t.clientName}
                      sx={{
                        width: "100%",
                        height: 220, // slightly taller
                        objectFit: "contain", // Show full photo without cutting
                        bgcolor: "#f4f4f5", // Light neutral background for padding
                        display: "block",
                      }}
                    />
                  )}
                  {t.type === "VIDEO" && t.mediaUrl && (
                    <Box sx={{ width: "100%", height: 220, bgcolor: "#000" }}>
                      <video
                        src={t.mediaUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        controls
                      />
                    </Box>
                  )}
                  
                  {/* Card Content with Fixed Height so cards are uniform */}
                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    {t.rating && (
                      <Box sx={{ color: "#f59e0b", mb: 1.5, display: "flex" }}>
                        {[...Array(t.rating)].map((_, i) => (
                          <StarIcon key={i} fontSize="small" />
                        ))}
                      </Box>
                    )}
                    
                    <Box sx={{ flexGrow: 1, mb: 2 }}>
                      {t.textContent && (
                        <Typography
                          sx={{
                            color: colors.textLight,
                            fontStyle: "italic",
                            lineHeight: 1.7,
                            fontSize: "0.9rem",
                            // Clamp text to max 4 lines
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          "{t.textContent}"
                        </Typography>
                      )}
                      
                      {/* Read More button triggers modal */}
                      {t.textContent && t.textContent.length > 120 && (
                        <Typography
                          component="span"
                          onClick={() => setSelectedTestimonial(t)}
                          sx={{
                            color: colors.primary,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-block",
                            mt: 0.5,
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Read full story
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{ display: "flex", gap: 1.25, alignItems: "center" }}
                    >
                      <Avatar
                        sx={{ background: gradientBrand, fontWeight: 700 }}
                      >
                        {t.clientName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{ fontWeight: 700, fontSize: "0.92rem" }}
                        >
                          {t.clientName}
                        </Typography>
                        {t.tag && (
                          <Typography
                            sx={{
                              fontSize: "0.78rem",
                              color: colors.primary,
                              fontWeight: 600,
                            }}
                          >
                            {t.tag}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          <IconButton
            className="carousel-arrow"
            onClick={() => scrollByAmount(1)}
            sx={{
              position: "absolute",
              right: -20,
              top: "40%",
              zIndex: 2,
              bgcolor: colors.white,
              boxShadow: 2,
              display: { xs: "none", md: "flex" },
              opacity: 0,
              transition: "opacity 0.25s",
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Container>

      {/* MODAL / DIALOG for Full Testimonial */}
      <Dialog
        open={Boolean(selectedTestimonial)}
        onClose={() => setSelectedTestimonial(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        {selectedTestimonial && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ background: gradientBrand }}>{selectedTestimonial.clientName?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {selectedTestimonial.clientName}
                  </Typography>
                  {selectedTestimonial.tag && (
                    <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 600 }}>
                      {selectedTestimonial.tag}
                    </Typography>
                  )}
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedTestimonial(null)} sx={{ color: colors.textLight }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 0 }}>
              {/* Media in Modal (Full Size) */}
              {selectedTestimonial.type === "PHOTO" && selectedTestimonial.mediaUrl && (
                <Box
                  component="img"
                  src={selectedTestimonial.mediaUrl}
                  alt={selectedTestimonial.clientName}
                  sx={{ width: "100%", maxHeight: "400px", objectFit: "contain", bgcolor: "#f4f4f5", display: "block" }}
                />
              )}
              {selectedTestimonial.type === "VIDEO" && selectedTestimonial.mediaUrl && (
                <Box sx={{ width: "100%", maxHeight: "400px", bgcolor: "#000" }}>
                  <video
                    src={selectedTestimonial.mediaUrl}
                    style={{ width: "100%", height: "100%", maxHeight: "400px", objectFit: "contain" }}
                    controls
                    autoPlay
                  />
                </Box>
              )}
              
              {/* Full Text in Modal */}
              <Box sx={{ p: 3 }}>
                {selectedTestimonial.rating && (
                  <Box sx={{ color: "#f59e0b", mb: 2, display: "flex" }}>
                    {[...Array(selectedTestimonial.rating)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </Box>
                )}
                <Typography sx={{ color: colors.text, fontStyle: "italic", lineHeight: 1.8, fontSize: "1rem" }}>
                  "{selectedTestimonial.textContent}"
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { colors, serifFont } from "../theme";
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";

/** Matches youtube.com/watch?v=, youtu.be/, and youtube.com/embed/ formats. */
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function VideoModal({ open, onClose, url }) {
  if (!url) return null;
  const youtubeId = extractYouTubeId(url);
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}` +
      `?autoplay=1` +
      `&mute=0` +
      `&controls=0` +
      `&loop=1` +
      `&playlist=${youtubeId}` +
      `&fs=1` +
      `&disablekb=1` +
      `&enablejsapi=1` +
      `&playsinline=1` +
      `&rel=0`
    : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#000",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close video"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          color: "#fff",
          bgcolor: "rgba(0,0,0,0.6)",
          zIndex: 10,
          "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, aspectRatio: "16/9", bgcolor: "#000" }}>
        {youtubeId ? (
          <Box
            component="iframe"
            src={embedUrl}
            title="Introduction video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            sx={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        ) : (
          <Box
            component="video"
            src={url}
            controls
            autoPlay
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Hero({ topOffset = 96 }) {
  const { openBooking } = useBooking();
  const { hero } = useSiteContent();
  const [videoOpen, setVideoOpen] = useState(false);

  // Use the cropped image from the uploaded design, or a high-res photo of a woman with salad in kitchen
  const heroBg = "/assets/images/nourish-hero-bg.png";

  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "580px", md: "680px" },
        display: "flex",
        alignItems: "center",
        pt: `${topOffset + 46}px`,
        pb: { xs: 8, md: 10 },
        backgroundImage: {
          xs: `linear-gradient(180deg, rgba(13, 21, 14, 0.88) 0%, rgba(13, 21, 14, 0.92) 100%), url("${heroBg}")`,
          md: `linear-gradient(to right, rgba(12, 19, 13, 0.92) 0%, rgba(12, 19, 13, 0.85) 45%, rgba(12, 19, 13, 0.35) 75%, rgba(12, 19, 13, 0.1) 100%), url("${heroBg}")`,
        },
        backgroundSize: {
          xs: "cover",
          md: "auto 100%",
        },
        backgroundPosition: {
          xs: "center center",
          md: "right center",
        },
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0d150e",
        color: "#ffffff",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ maxWidth: { xs: "100%", md: "620px" } }}>
          {/* Eyebrow */}
          <Typography
            sx={{
              color: "#9db884",
              fontWeight: 700,
              fontSize: { xs: "0.78rem", sm: "0.85rem" },
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Nutrition Coaching For Real Life
          </Typography>

          {/* Headline */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: serifFont,
              fontSize: { xs: "2.5rem", sm: "3.2rem", md: "3.85rem" },
              fontWeight: 600,
              lineHeight: 1.12,
              color: "#ffffff",
              mb: 2.5,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {hero.headline || "Nourish Your Body."}
            <br />
            {hero.headlineHighlight || "Transform Your Life."}
          </Typography>

          {/* Tagline */}
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem" },
              lineHeight: 1.75,
              color: "rgba(255, 255, 255, 0.88)",
              mb: 4.5,
              fontWeight: 400,
              maxWidth: 540,
            }}
          >
            {hero.tagline ||
              "Personalized nutrition coaching to help you build healthy habits, feel your best, and reach your goals—without extreme diets or restrictions."}
          </Typography>

          {/* Call to action buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Button
              onClick={openBooking}
              variant="contained"
              size="large"
              sx={{
                bgcolor: colors.primary,
                color: colors.white,
                py: 1.6,
                px: 3.8,
                borderRadius: 50,
                fontSize: "0.95rem",
                fontWeight: 600,
                boxShadow: "0 8px 24px rgba(121, 152, 91, 0.35)",
                "&:hover": {
                  bgcolor: colors.primaryDark,
                },
              }}
            >
              Book Your Free Consultation
            </Button>

            {hero.videoUrl && (
              <Button
                onClick={() => setVideoOpen(true)}
                variant="text"
                size="large"
                startIcon={
                  <PlayCircleOutlineIcon sx={{ fontSize: "1.4rem" }} />
                }
                sx={{
                  color: "#ffffff",
                  py: 1.4,
                  px: 2.5,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                Watch Video
              </Button>
            )}
          </Stack>
        </Box>
      </Container>

      {/* Video Lightbox Modal */}
      {hero.videoUrl && (
        <VideoModal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          url={hero.videoUrl}
        />
      )}
    </Box>
  );
}

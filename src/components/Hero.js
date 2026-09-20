import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EventIcon from "@mui/icons-material/Event";
import { colors, gradientBrand } from "../theme";
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

const trustStats = [
  { number: "500+", label: "Clients Guided" },
  { number: "8+", label: "Years Experience" },
  { number: "4.9★", label: "Client Rating" },
];

/** Matches youtube.com/watch?v=, youtu.be/, and youtube.com/embed/ formats. */
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

/** YouTube link -> autoplaying muted looping embed. Anything else (e.g. a
 *  direct Cloudinary .mp4 URL) -> native HTML5 video, same behavior. */
function VideoEmbed({ url }) {
  const iframeRef = useRef(null);
  const videoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!url) {
    return <Typography sx={{ fontSize: "3.5rem" }}>🎥</Typography>;
  }

  const youtubeId = extractYouTubeId(url);

  const sendYouTubeCommand = (func, args = []) => {
    if (!iframeRef.current) return;

    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args,
      }),
      "https://www.youtube.com",
    );
  };

  const handleMuteToggle = () => {
    if (youtubeId) {
      if (isMuted) {
        sendYouTubeCommand("unMute");
        setIsMuted(false);
      } else {
        sendYouTubeCommand("mute");
        setIsMuted(true);
      }
    } else if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleFullscreen = async () => {
    const element = youtubeId ? iframeRef.current : videoRef.current;

    if (!element) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

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
    <Box
      className="video-container"
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {youtubeId ? (
        <Box
          component="iframe"
          ref={iframeRef}
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
          ref={videoRef}
          src={url}
          autoPlay
          muted
          loop
          playsInline
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      {/* Custom controls */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          right: 16,
          bottom: 16,
          zIndex: 10,

          opacity: 0,
          visibility: "hidden",
          transition: "opacity 0.25s ease, visibility 0.25s ease",

          ".video-container:hover &": {
            opacity: 1,
            visibility: "visible",
          },
        }}
      >
        <IconButton
          onClick={handleMuteToggle}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          sx={{
            width: 42,
            height: 42,
            bgcolor: "rgba(0,0,0,0.25)",
            color: "#fff",
            backdropFilter: "blur(4px)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.75)",
            },
          }}
        >
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>

        <IconButton
          onClick={handleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          sx={{
            width: 42,
            height: 42,
            bgcolor: "rgba(0,0,0,0.25)",
            color: "#fff",
            backdropFilter: "blur(4px)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.75)",
            },
          }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Stack>
    </Box>
  );
}

export default function Hero({ topOffset = 96 }) {
  const { openBooking } = useBooking();
  const { contact, hero } = useSiteContent();
  const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: `${topOffset + 46}px`,
        pb: 11,
        // background: `linear-gradient( 180deg, rgba(245, 246, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%)`,
      }}
    >
      {/* <Box
          component="img"
          // src="/assets/images/HeroBg.png"
          alt=""
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: {
              xs: "center center",
              md: "center center",
            },
            opacity: 0.55,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        /> */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.85fr 1.15fr" },
            gap: { xs: 5, md: 6 },
            alignItems: "center",
          }}
        >
          <Box>
            <Chip
              label="🌿 Certified Nutritionist & Dietitian"
              sx={{
                bgcolor: "rgba(99,102,241,0.1)",
                color: colors.primary,
                fontWeight: 700,
                mb: 2.5,
                px: 1,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.2rem", md: "3.1rem" },
                lineHeight: 1.15,
                mb: 2.5,
              }}
            >
              {hero.headline}{" "}
              <Box
                component="span"
                sx={{
                  background: gradientBrand,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {hero.headlineHighlight}
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: "1.15rem",
                color: colors.textLight,
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              {hero.tagline}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 5 }}
            >
              <Button
                onClick={openBooking}
                variant="contained"
                size="large"
                startIcon={<EventIcon />}
                sx={{
                  background: gradientBrand,
                  py: 1.7,
                  px: 4,
                  boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
                }}
              >
                Book Consultation
              </Button>
              <Button
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  bgcolor: colors.whatsapp,
                  py: 1.7,
                  px: 4,
                  boxShadow: "0 4px 15px rgba(37,211,102,0.3)",
                  "&:hover": { bgcolor: "#1fb356" },
                }}
              >
                WhatsApp Me
              </Button>
            </Stack>

            <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
              {trustStats.map((t) => (
                <Box key={t.label}>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: colors.primary,
                    }}
                  >
                    {t.number}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: colors.textLight }}
                  >
                    {t.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                background: gradientBrand,
                borderRadius: "10px",
                aspectRatio: "16/10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 30px 60px rgba(99,102,241,0.25)",
                overflow: "hidden",
                width: "100%",
              }}
            >
              <VideoEmbed url={hero.videoUrl} />
            </Box>
            {/* <Paper
              elevation={0}
              sx={{
                position: 'absolute', bottom: -20, left: -20,
                p: '18px 24px', borderRadius: '16px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', gap: 1.75,
              }}
            >
              <Box
                sx={{
                  width: 44, height: 44, borderRadius: '10px',
                  background: gradientBrand,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.white, fontSize: '1.2rem',
                }}
              >
                🎓
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>M.Sc. Nutrition</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: colors.textLight }}>Registered Dietitian</Typography>
              </Box>
            </Paper> */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Tooltip } from "@mui/material";
import { colors } from "../theme";

const SECTIONS = [
  { id: "home", label: "Hero" },
  { id: "benefits", label: "Benefits" },
  { id: "programs", label: "Programs" },
  { id: "about", label: "About" },
  { id: "quiz", label: "Quiz" },
  { id: "how-it-works", label: "How It Works" },
  { id: "testimonials", label: "Reviews" },
  { id: "health-tools", label: "Tools" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export default function CustomPageScrollbar({ topOffset = 80 }) {
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("home");
  const hideTimerRef = useRef(null);
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Trigger visibility on scroll and schedule fade out
  const triggerVisible = useCallback(() => {
    setIsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    // Disappear after 1.4s of no scroll activity
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1400);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      triggerVisible();

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / docHeight));
        setScrollProgress(progress);
      }

      // Detect active section
      const scrollPos = window.scrollY + topOffset + 100;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [triggerVisible, topOffset]);

  // Jump smoothly to a specific section
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const targetTop = Math.max(0, el.offsetTop - (topOffset > 0 ? topOffset : 0));
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }
  };

  // Click on track to jump
  const handleTrackClick = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = Math.min(1, Math.max(0, clickY / rect.height));
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: ratio * docHeight, behavior: "smooth" });
  };

  // Drag handling
  const handlePointerDown = (e) => {
    e.stopPropagation();
    isDraggingRef.current = true;

    const onPointerMove = (moveEvent) => {
      if (!isDraggingRef.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const moveY = moveEvent.clientY - rect.top;
      const ratio = Math.min(1, Math.max(0, moveY / rect.height));
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: ratio * docHeight, behavior: "auto" });
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // Visible if currently scrolling OR if hovered
  const shouldShow = isVisible || isHovered;

  // Track height calculation
  const TRACK_HEIGHT = 220; // sleek compact vertical slider
  const THUMB_HEIGHT = 36;
  const thumbTop = scrollProgress * (TRACK_HEIGHT - THUMB_HEIGHT);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        triggerVisible();
      }}
      sx={{
        position: "fixed",
        right: { xs: 3, md: 8 },
        top: "50%",
        transform: "translateY(-50%)",
        width: isHovered ? 24 : 14,
        height: TRACK_HEIGHT + 20,
        zIndex: 1250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        opacity: shouldShow ? (isHovered ? 0.95 : 0.38) : 0,
        transition: "opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s ease",
        pointerEvents: shouldShow ? "auto" : "none",
      }}
    >
      {/* Sleek Slim Track */}
      <Box
        ref={trackRef}
        onClick={handleTrackClick}
        sx={{
          position: "relative",
          width: isHovered ? 5 : 3,
          height: TRACK_HEIGHT,
          borderRadius: "8px",
          bgcolor: isHovered ? "rgba(56, 75, 50, 0.14)" : "rgba(56, 75, 50, 0.08)",
          transition: "width 0.2s ease, background-color 0.2s ease",
        }}
      >
        {/* Section Tick Dots (Visible on hover for quick jump) */}
        {isHovered &&
          SECTIONS.map((sec, idx) => {
            const dotProgress = idx / (SECTIONS.length - 1);
            const dotTop = dotProgress * (TRACK_HEIGHT - 6);
            const isActive = activeSectionId === sec.id;

            return (
              <Tooltip key={sec.id} title={sec.label} placement="left" arrow>
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToSection(sec.id);
                  }}
                  sx={{
                    position: "absolute",
                    top: dotTop,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isActive ? 7 : 4,
                    height: isActive ? 7 : 4,
                    borderRadius: "50%",
                    bgcolor: isActive ? colors.primaryDark : "rgba(56, 75, 50, 0.35)",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      transform: "translateX(-50%) scale(1.4)",
                      bgcolor: colors.primaryDark,
                    },
                  }}
                />
              </Tooltip>
            );
          })}

        {/* The Slim Sliding Thumb Pill */}
        <Box
          onPointerDown={handlePointerDown}
          sx={{
            position: "absolute",
            top: thumbTop,
            left: "50%",
            transform: "translateX(-50%)",
            width: isHovered ? 6 : 3,
            height: THUMB_HEIGHT,
            borderRadius: "10px",
            bgcolor: colors.primaryDark,
            boxShadow: isHovered ? "0 2px 8px rgba(36, 43, 35, 0.25)" : "none",
            transition: isDraggingRef.current
              ? "none"
              : "width 0.2s ease, box-shadow 0.2s ease",
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
        />
      </Box>
    </Box>
  );
}

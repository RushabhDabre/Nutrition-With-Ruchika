import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";

export default function RevealOnScroll({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 24,
  variant = "fade-up", // "fade-up", "fade-down", "scale-up", "fade-in", "slide-left", "slide-right"
  threshold = 0.08,
  sx = {},
  ...props
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold]);

  const getInitialTransform = () => {
    switch (variant) {
      case "fade-down":
        return `translateY(-${yOffset}px)`;
      case "scale-up":
        return "scale(0.94)";
      case "slide-left":
        return `translateX(${yOffset}px)`;
      case "slide-right":
        return `translateX(-${yOffset}px)`;
      case "fade-in":
        return "none";
      case "fade-up":
      default:
        return `translateY(${yOffset}px)`;
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : getInitialTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: revealed ? "auto" : "opacity, transform",
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none !important",
          transform: "none !important",
          opacity: "1 !important",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

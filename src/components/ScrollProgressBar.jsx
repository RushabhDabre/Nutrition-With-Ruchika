import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { colors } from "../theme";

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 1300,
        bgcolor: "transparent",
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${scrollProgress}%`,
          bgcolor: colors.primaryDark,
          transition: "width 0.1s ease-out",
        }}
      />
    </Box>
  );
}

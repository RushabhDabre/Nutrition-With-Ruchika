import React, { useState, useEffect } from "react";
import { Fab, Tooltip, Zoom } from "@mui/material";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { colors } from "../theme";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 280px (past hero)
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom in={visible}>
      <Tooltip title="Back to top" placement="left" arrow>
        <Fab
          onClick={scrollToTop}
          size="medium"
          aria-label="Scroll back to top"
          sx={{
            position: "fixed",
            bottom: { xs: 150, md: 100 },
            right: 32,
            zIndex: 1050,
            bgcolor: colors.primaryDark,
            color: "#ffffff",
            width: 48,
            height: 48,
            boxShadow: "0 8px 24px rgba(36, 43, 35, 0.28)",
            border: "1.5px solid rgba(255, 255, 255, 0.2)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: colors.darkGreenHover,
              transform: "translateY(-3px) scale(1.05)",
              boxShadow: "0 12px 28px rgba(36, 43, 35, 0.38)",
            },
            "&:active": {
              transform: "translateY(0) scale(0.96)",
            },
          }}
        >
          <KeyboardArrowUpRoundedIcon sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}

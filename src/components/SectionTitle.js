import React from "react";
import { Box, Typography } from "@mui/material";
import { colors } from "../theme";

export default function SectionTitle({ eyebrow, title, subtitle, align = "center", mb, sx = {} }) {
  return (
    <Box sx={{ textAlign: align, mb: mb !== undefined ? mb : { xs: 2.5, md: 3 }, ...sx }}>
      {eyebrow && (
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: colors.primary,
            mb: 1,
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          fontWeight: 700,
          color: colors.textDark,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          mb: subtitle ? 1 : 0,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: colors.textLight,
            maxWidth: 520,
            mx: align === "center" ? "auto" : 0,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

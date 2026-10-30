import React from "react";
import { Box } from "@mui/material";

export default function BrandLogo({ isDark = false, scale = 1, sx = {} }) {
  const logoSrc = isDark
    ? "/assets/images/NutritionWithRuchikaThemeLogoDark.png"
    : "/assets/images/NutritionWithRuchikaThemeLogo.png";

  return (
    <Box
      component="img"
      src={logoSrc}
      alt="Nutrition with Ruchika"
      sx={{
        height: {
          xs: 40 * scale,
          sm: 46 * scale,
          md: 52 * scale,
        },
        width: "auto",
        maxWidth: "100%",
        display: "block",
        userSelect: "none",
        ...sx,
      }}
    />
  );
}

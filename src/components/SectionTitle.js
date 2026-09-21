import React from 'react';
// import { Box, Typography, Chip } from '@mui/material';
// import { colors } from '../theme';
import { Box, Chip, Typography } from "@mui/material";
import { colors, serifFont } from "../theme";

export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    // <Box sx={{ textAlign: 'center', mb: 7 }}>
    <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
      {eyebrow && (<>
        <Chip label={eyebrow} sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: colors.primary, fontWeight: 700, mb: 1.75, px: 1 }} />
        <Typography
          sx={{
            color: colors.primary,
            fontWeight: 700,
            fontSize: "0.82rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            mb: 1.5,
          }}
        >
          {eyebrow}
        </Typography>
      </>)}
      {/* <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.5rem' }, mb: 1.75 }}> */}
      <Typography
        variant="h2"
        sx={{
          fontFamily: serifFont,
          fontSize: { xs: "2.1rem", md: "2.7rem" },
          fontWeight: 600,
          color: colors.textDark,
          mb: 1.75,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        // <Typography sx={{ fontSize: '1.05rem', color: colors.textLight, maxWidth: 600, mx: 'auto' }}>
        <Typography
          sx={{
            fontSize: "1rem",
            color: colors.textLight,
            maxWidth: 620,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

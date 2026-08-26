import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { colors } from '../theme';

export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <Box sx={{ textAlign: 'center', mb: 7 }}>
      {eyebrow && (
        <Chip label={eyebrow} sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: colors.primary, fontWeight: 700, mb: 1.75, px: 1 }} />
      )}
      <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.5rem' }, mb: 1.75 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ fontSize: '1.05rem', color: colors.textLight, maxWidth: 600, mx: 'auto' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

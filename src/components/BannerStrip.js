import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { keyframes } from '@emotion/react';
import { colors, gradientBrand } from '../theme';
import { apiBaseUrl } from '../data/siteData';
import ProgramEnrollModal from './ProgramEnrollModal';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
`;

export default function BannerStrip() {
  const [banners, setBanners] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [enrollOpen, setEnrollOpen] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/banners`)
      .then((res) => res.json())
      .then(setBanners)
      .catch(() => setBanners([]));
  }, []);

  const current = banners?.find(
    (b) => b.displayType !== 'MODAL' && b.active && !dismissedIds.includes(b.id)
  );

  if (!current) return null;

  const handleDismiss = () => {
    setDismissedIds((prev) => [...prev, current.id]);
  };

  return (
    <Box sx={{ background: gradientBrand, py: 1.1, position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', minHeight: 28 }}>
            {current.imageUrl ? (
              <Box component="img" src={current.imageUrl} alt="" sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <Box component="span" sx={{ fontSize: '1.1rem', display: 'inline-block', animation: `${pulse} 1.8s ease-in-out infinite` }}>
                🎉
              </Box>
            )}

            <Typography sx={{ color: colors.white, fontWeight: 700, fontSize: '0.85rem' }}>
              {current.title}
            </Typography>

            {current.subtitle && (
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', display: { xs: 'none', sm: 'block' } }}>
                {current.subtitle}
              </Typography>
            )}

            {current.paymentRequired ? (
              <Button
                variant="contained"
                size="small"
                onClick={() => setEnrollOpen(true)}
                sx={{
                  bgcolor: colors.white,
                  color: colors.primary,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.3,
                  borderRadius: '20px',
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.92)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {current.buttonText ||
                  `Enroll Now${current.priceInr ? ` · ₹${current.priceInr}` : ''}`}
                <ArrowForwardIcon sx={{ fontSize: '0.85rem', ml: 0.5 }} />
              </Button>
            ) : current.linkUrl ? (
              <Box
                component="a"
                href={current.linkUrl}
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: colors.primary,
                  bgcolor: colors.white,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.4,
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                {current.buttonText || 'Learn More'}
                <ArrowForwardIcon sx={{ fontSize: '0.85rem' }} />
              </Box>
            ) : null}
          </Box>
      </Container>

      <IconButton
        onClick={handleDismiss}
        size="small"
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'rgba(255,255,255,0.85)',
          p: 0.4,
          '&:hover': { color: colors.white, bgcolor: 'rgba(255,255,255,0.15)' },
        }}
      >
        <CloseIcon sx={{ fontSize: '1rem' }} />
      </IconButton>

      {current.paymentRequired && (
        <ProgramEnrollModal
          open={enrollOpen}
          onClose={() => setEnrollOpen(false)}
          plan={{
            id: current.id,
            isBanner: true,
            bannerId: current.id,
            name: current.title,
            priceInr: current.priceInr,
            description: current.subtitle,
          }}
        />
      )}
    </Box>
  );
}
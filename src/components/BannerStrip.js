import React, { useEffect, useState, useCallback } from 'react';
import { Box, Container, Typography, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { keyframes } from '@emotion/react';
import { colors, gradientBrand } from '../theme';
import { apiBaseUrl } from '../data/siteData';

const ROTATE_INTERVAL_MS = 5000;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
`;

export default function BannerStrip() {
  const [banners, setBanners] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/banners`)
      .then((res) => res.json())
      .then(setBanners)
      .catch(() => setBanners([]));
  }, []);

  const activeBanners = banners?.filter((b) => b.displayType !== 'MODAL' && !dismissedIds.includes(b.id));

  const advance = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % Math.max(activeBanners.length, 1));
      setVisible(true);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1) return undefined;
    const timer = setInterval(advance, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [activeBanners.length, advance]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[index % activeBanners.length];

  const handleDismiss = () => {
    setDismissedIds((prev) => [...prev, current.id]);
    setIndex(0);
  };

  return (
    <Box sx={{ background: gradientBrand, py: 1.1, position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Fade in={visible} timeout={300}>
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

            {current.linkUrl && (
              <Box
                component="a"
                href={current.linkUrl}
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.5,
                  color: colors.primary, bgcolor: colors.white, fontWeight: 700, fontSize: '0.75rem',
                  px: 1.5, py: 0.4, borderRadius: '20px', textDecoration: 'none',
                  transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                {current.buttonText || 'Learn More'}
                <ArrowForwardIcon sx={{ fontSize: '0.85rem' }} />
              </Box>
            )}
          </Box>
        </Fade>
      </Container>

      <IconButton
        onClick={handleDismiss}
        size="small"
        sx={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          color: 'rgba(255,255,255,0.85)', p: 0.4,
          '&:hover': { color: colors.white, bgcolor: 'rgba(255,255,255,0.15)' },
        }}
      >
        <CloseIcon sx={{ fontSize: '1rem' }} />
      </IconButton>
    </Box>
  );
}
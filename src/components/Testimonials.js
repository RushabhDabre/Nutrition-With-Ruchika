import React, { useEffect, useState, useRef } from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { colors, gradientBrand } from '../theme';
import { apiBaseUrl } from '../data/siteData';
import SectionTitle from './SectionTitle';

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/testimonials`)
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <Box component="section" id="testimonials" sx={{ py: 11 }}>
      <Container maxWidth="lg">
        <SectionTitle eyebrow="Client Stories" title="What Clients Say" subtitle="Real results from real people" />

        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => scroll(-1)}
            sx={{ position: 'absolute', left: -20, top: '40%', zIndex: 2, bgcolor: colors.white, boxShadow: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Box
            ref={scrollRef}
            sx={{
              display: 'flex', gap: 2.5, overflowX: 'auto', scrollSnapType: 'x mandatory',
              pb: 2, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none',
            }}
          >
            {items.map((t) => (
              <Card
                key={t.id}
                sx={{
                  minWidth: 300, maxWidth: 300, flexShrink: 0, scrollSnapAlign: 'start', overflow: 'hidden',
                  transition: 'all 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 18px 40px rgba(99,102,241,0.1)', borderColor: colors.primary },
                }}
              >
                {t.type === 'PHOTO' && t.mediaUrl && (
                  <Box component="img" src={t.mediaUrl} alt={t.clientName} sx={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                )}
                {t.type === 'VIDEO' && t.mediaUrl && (
                  <Box sx={{ width: '100%', height: 180, bgcolor: '#000' }}>
                    <video src={t.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                  </Box>
                )}
                <CardContent>
                  {t.rating && (
                    <Box sx={{ color: '#f59e0b', mb: 1.5, display: 'flex' }}>
                      {[...Array(t.rating)].map((_, i) => <StarIcon key={i} fontSize="small" />)}
                    </Box>
                  )}
                  {t.textContent && (
                    <Typography sx={{ color: colors.textLight, fontStyle: 'italic', mb: 2, lineHeight: 1.7, fontSize: '0.9rem' }}>
                      "{t.textContent}"
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                    <Avatar sx={{ background: gradientBrand, fontWeight: 700 }}>{t.clientName?.[0]}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>{t.clientName}</Typography>
                      {t.tag && <Typography sx={{ fontSize: '0.78rem', color: colors.primary, fontWeight: 600 }}>{t.tag}</Typography>}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <IconButton
            onClick={() => scroll(1)}
            sx={{ position: 'absolute', right: -20, top: '40%', zIndex: 2, bgcolor: colors.white, boxShadow: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

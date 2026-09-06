import React from 'react';
import { Box, Container, Typography, Button, Chip, Stack, Paper } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EventIcon from '@mui/icons-material/Event';
import { colors, gradientBrand } from '../theme';
import { useBooking } from '../context/BookingContext';
import { useSiteContent } from '../context/SiteContentContext';

const trustStats = [
  { number: '500+', label: 'Clients Guided' },
  { number: '8+', label: 'Years Experience' },
  { number: '4.9★', label: 'Client Rating' },
];

export default function Hero() {
  const { openBooking } = useBooking();
  const { contact, hero } = useSiteContent();
  const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

  return (
    <Box id="home" sx={{ pt: { xs: 18, md: 20 }, pb: 11, background: 'linear-gradient(180deg, #f5f6ff 0%, #ffffff 100%)' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: { xs: 6, md: 8 },
            alignItems: 'center',
          }}
        >
          <Box>
            <Chip
              label="🌿 Certified Nutritionist & Dietitian"
              sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: colors.primary, fontWeight: 700, mb: 2.5, px: 1 }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3.1rem' }, lineHeight: 1.15, mb: 2.5 }}>
              {hero.headline}{' '}
              <Box
                component="span"
                sx={{
                  background: gradientBrand,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {hero.headlineHighlight}
              </Box>
            </Typography>
            <Typography sx={{ fontSize: '1.15rem', color: colors.textLight, mb: 4, lineHeight: 1.8 }}>
              {hero.tagline}
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 5 }}>
              <Button
                onClick={openBooking}
                variant="contained"
                size="large"
                startIcon={<EventIcon />}
                sx={{ background: gradientBrand, py: 1.7, px: 4, boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
              >
                Book Consultation
              </Button>
              <Button
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                size="large"
                startIcon={<WhatsAppIcon />}
                sx={{ bgcolor: colors.whatsapp, py: 1.7, px: 4, boxShadow: '0 4px 15px rgba(37,211,102,0.3)', '&:hover': { bgcolor: '#1fb356' } }}
              >
                WhatsApp Me
              </Button>
            </Stack>

            <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
              {trustStats.map((t) => (
                <Box key={t.label}>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: colors.primary }}>{t.number}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: colors.textLight }}>{t.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                background: gradientBrand,
                borderRadius: '24px',
                aspectRatio: '4/5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 30px 60px rgba(99,102,241,0.25)',
                overflow: 'hidden',
              }}
            >
              <Typography sx={{ fontSize: '5rem' }}>👩‍⚕️</Typography>
            </Box>
            <Paper
              elevation={0}
              sx={{
                position: 'absolute', bottom: -20, left: -20,
                p: '18px 24px', borderRadius: '16px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', gap: 1.75,
              }}
            >
              <Box
                sx={{
                  width: 44, height: 44, borderRadius: '10px',
                  background: gradientBrand,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.white, fontSize: '1.2rem',
                }}
              >
                🎓
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>M.Sc. Nutrition</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: colors.textLight }}>Registered Dietitian</Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

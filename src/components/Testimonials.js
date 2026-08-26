import React from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { colors, gradientBrand } from '../theme';
import { testimonials } from '../data/siteData';
import SectionTitle from './SectionTitle';

export default function Testimonials() {
  return (
    <Box component="section" id="testimonials" sx={{ py: 11 }}>
      <Container maxWidth="lg">
        <SectionTitle eyebrow="Client Stories" title="What Clients Say" subtitle="Real results from real people" />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 3.25 }}>
          {testimonials.map((t) => (
            <Card
              key={t.name}
              sx={{
                p: 1, transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 18px 40px rgba(99,102,241,0.1)', borderColor: colors.primary },
              }}
            >
              <CardContent>
                <Box sx={{ color: '#f59e0b', mb: 1.75, display: 'flex' }}>
                  {[...Array(5)].map((_, i) => <StarIcon key={i} fontSize="small" />)}
                </Box>
                <Typography sx={{ color: colors.textLight, fontStyle: 'italic', mb: 2.75, lineHeight: 1.8, fontSize: '0.94rem' }}>
                  "{t.text}"
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Avatar sx={{ background: gradientBrand, fontWeight: 700 }}>{t.initial}</Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: colors.primary, fontWeight: 600 }}>{t.tag}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

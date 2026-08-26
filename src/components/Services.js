import React from 'react';
import { Box, Container, Typography, Card, CardContent, Chip } from '@mui/material';
import { colors, gradientPrimary } from '../theme';
import { services } from '../data/siteData';
import SectionTitle from './SectionTitle';

export default function Services() {
  return (
    <Box component="section" id="services" sx={{ py: 11 }}>
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="Services"
          title="Areas I Specialize In"
          subtitle="Tailored nutrition programs designed around your specific health goals"
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 3.5 }}>
          {services.map((s) => (
            <Card
              key={s.title}
              sx={{
                p: 1, position: 'relative', overflow: 'hidden', transition: 'all 0.3s',
                '&::before': {
                  content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                  transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.3s',
                },
                '&:hover': { borderColor: colors.primary, transform: 'translateY(-6px)', boxShadow: '0 18px 40px rgba(99,102,241,0.12)' },
                '&:hover::before': { transform: 'scaleX(1)' },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    width: 56, height: 56, borderRadius: '12px',
                    background: gradientPrimary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: colors.white, fontSize: '1.6rem', mb: 2.25,
                  }}
                >
                  {s.icon}
                </Box>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, mb: 1.25 }}>{s.title}</Typography>
                <Typography sx={{ color: colors.textLight, fontSize: '0.92rem', mb: 2 }}>{s.text}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {s.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ bgcolor: 'rgba(99,102,241,0.08)', color: colors.primary, fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

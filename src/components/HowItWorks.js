import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { colors, gradientBrand } from '../theme';
import SectionTitle from './SectionTitle';

const steps = [
  {
    icon: <PhoneInTalkIcon sx={{ fontSize: '1.8rem' }} />,
    title: 'Consultation Call',
    text: 'Book your slot and hop on a call — we discuss your goals, health history, and lifestyle in detail.',
  },
  {
    icon: <FactCheckIcon sx={{ fontSize: '1.8rem' }} />,
    title: 'Pick the Right Program',
    text: "Based on the call, I recommend the program that actually fits your goals and budget — no pressure, no upsell.",
  },
  {
    icon: <RestaurantMenuIcon sx={{ fontSize: '1.8rem' }} />,
    title: 'Personalized Plan Starts',
    text: 'Your custom diet plan is built around your routine and preferences, with regular check-ins to keep you on track.',
  },
];

export default function HowItWorks() {
  return (
    <Box component="section" sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="How It Works"
          title="What Happens After You Book"
          subtitle="A simple, three-step process from your first call to your personalized plan"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 5, md: 4 },
            position: 'relative',
          }}
        >
          {/* Connecting line - desktop only, sits behind the circles */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute', top: 32, left: '16.5%', right: '16.5%', height: 2,
              background: colors.border, zIndex: 0,
            }}
          />

          {steps.map((step, i) => (
            <Box key={step.title} sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 64, height: 64, borderRadius: '50%', mx: 'auto', mb: 2.5,
                  background: gradientBrand, color: colors.white,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                }}
              >
                {step.icon}
              </Box>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: colors.primary, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Step {i + 1}
              </Typography>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, mb: 1.25 }}>{step.title}</Typography>
              <Typography sx={{ color: colors.textLight, fontSize: '0.92rem', maxWidth: 280, mx: 'auto' }}>{step.text}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

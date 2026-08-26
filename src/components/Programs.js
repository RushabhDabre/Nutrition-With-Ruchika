import React from 'react';
import { Box, Container, Typography, Card, CardContent, Button, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { colors, gradientBrand } from '../theme';
import { pricingPlans } from '../data/siteData';
import SectionTitle from './SectionTitle';

export default function Programs() {
  return (
    <Box component="section" id="programs" sx={{ py: 11, bgcolor: colors.bgLight }}>
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="Programs & Pricing"
          title="Choose Your Program"
          subtitle="Transparent pricing, no hidden costs — pick the plan that fits your goals"
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3.75 }}>
          {pricingPlans.map((p) => (
            <Card
              key={p.name}
              sx={{
                p: 1.5, position: 'relative', bgcolor: colors.white,
                ...(p.featured && {
                  borderColor: colors.primary,
                  transform: { md: 'scale(1.04)' },
                  boxShadow: '0 25px 60px rgba(99,102,241,0.18)',
                }),
              }}
            >
              {p.badge && (
                <Chip
                  label={p.badge}
                  sx={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: gradientBrand, color: colors.white, fontWeight: 700,
                  }}
                />
              )}
              <CardContent>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, mb: 1 }}>{p.name}</Typography>
                <Typography sx={{ color: colors.textLight, fontSize: '0.88rem', mb: 2.5 }}>{p.desc}</Typography>
                <Typography sx={{ fontSize: '2.6rem', fontWeight: 800, color: colors.primary, lineHeight: 1.1 }}>{p.price}</Typography>
                <Typography sx={{ color: colors.textLight, fontSize: '0.9rem', mb: 3 }}>{p.period}</Typography>
                <List dense disablePadding sx={{ mb: 3.5 }}>
                  {p.features.map((f) => (
                    <ListItem key={f} disableGutters sx={{ py: 1.1, borderBottom: `1px solid ${colors.border}` }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon sx={{ fontSize: '1.05rem', color: colors.success }} />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: '0.92rem', color: colors.textLight }} primary={f} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  href="#contact"
                  fullWidth
                  size="large"
                  variant={p.featured ? 'contained' : 'outlined'}
                  sx={
                    p.featured
                      ? { background: gradientBrand, py: 1.5, boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }
                      : { py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }
                  }
                >
                  Choose {p.name.split(' ')[0]}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

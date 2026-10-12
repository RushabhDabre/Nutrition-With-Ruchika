import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, List, ListItem, ListItemIcon, ListItemText, Chip, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { colors, gradientBrand } from '../theme';
import { pricingPlans, apiBaseUrl } from '../data/siteData';
import SectionTitle from './SectionTitle';
import ProgramEnrollModal from './ProgramEnrollModal';

export default function Programs() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/programs`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load programs");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Map backend plans to match card presentation
          const mapped = data.map((bp) => ({
            id: bp.id,
            name: bp.name,
            desc: bp.description,
            price: `₹${bp.priceInr.toLocaleString('en-IN')}`,
            priceInr: bp.priceInr,
            period: bp.customPlan ? 'Special Plan' : 'Per Program',
            featured: bp.name.toLowerCase().includes('special') || bp.name.toLowerCase().includes('navratri') || bp.name.toLowerCase().includes('transformation'),
            badge: bp.name.toLowerCase().includes('navratri') ? 'Festive Special' : (bp.name.toLowerCase().includes('transformation') ? 'Most Popular' : null),
            features: [
              'Customized meal and diet chart',
              'Direct 1-on-1 WhatsApp guidance',
              'Progress tracking & adjustments',
              'Sustainable ghar ka khana recipes',
            ],
          }));
          setPlans(mapped);
        } else {
          // Fallback to static pricing plans if none in database yet
          setPlans(pricingPlans);
        }
      })
      .catch(() => {
        setPlans(pricingPlans);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleOpenEnroll = (plan) => {
    // If it's a fallback plan without a backend UUID, ensure priceInr is numeric
    const cleanPlan = {
      ...plan,
      priceInr: plan.priceInr || parseInt(plan.price.replace(/[^\d]/g, ''), 10),
    };
    setSelectedPlan(cleanPlan);
    setModalOpen(true);
  };

  return (
    <Box component="section" id="programs" sx={{ py: 11, bgcolor: colors.bgLight }}>
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="Programs & Special Plans"
          title="Choose Your Nutrition Program"
          subtitle="Direct enrollment with instant access — start your health journey today"
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: colors.primary }} />
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3.75 }}>
            {plans.map((p) => (
              <Card
                key={p.name}
                sx={{
                  p: 1.5, position: 'relative', bgcolor: colors.white,
                  display: 'flex', flexDirection: 'column',
                  borderRadius: 3.5,
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
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, mb: 1 }}>{p.name}</Typography>
                  <Typography sx={{ color: colors.textLight, fontSize: '0.88rem', mb: 2.5, minHeight: 40 }}>
                    {p.desc}
                  </Typography>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: colors.primary, lineHeight: 1.1 }}>
                    {p.price}
                  </Typography>
                  <Typography sx={{ color: colors.textLight, fontSize: '0.9rem', mb: 3 }}>
                    {p.period}
                  </Typography>
                  <List dense disablePadding sx={{ mb: 3.5, flexGrow: 1 }}>
                    {(p.features || []).map((f) => (
                      <ListItem key={f} disableGutters sx={{ py: 1.1, borderBottom: `1px solid ${colors.border}` }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleIcon sx={{ fontSize: '1.05rem', color: colors.success }} />
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '0.92rem', color: colors.textLight }} primary={f} />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    onClick={() => handleOpenEnroll(p)}
                    fullWidth
                    size="large"
                    variant={p.featured ? 'contained' : 'outlined'}
                    sx={
                      p.featured
                        ? { background: gradientBrand, py: 1.5, boxShadow: '0 4px 15px rgba(99,102,241,0.3)', fontWeight: 700 }
                        : { py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 }, fontWeight: 700 }
                    }
                  >
                    Enroll in {p.name.split(' ')[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Direct Payment Checkout Modal */}
      {selectedPlan && (
        <ProgramEnrollModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          plan={selectedPlan}
        />
      )}
    </Box>
  );
}

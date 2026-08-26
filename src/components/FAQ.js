import React from 'react';
import { Box, Container, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { colors } from '../theme';
import { faqs } from '../data/siteData';
import SectionTitle from './SectionTitle';

export default function FAQ() {
  return (
    <Box component="section" id="faq" sx={{ py: 11, bgcolor: colors.bgLight }}>
      <Container maxWidth="md">
        <SectionTitle eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Answers to what clients ask me most" />
        <Box>
          {faqs.map((item) => (
            <Accordion
              key={item.q}
              disableGutters
              elevation={0}
              sx={{
                border: `2px solid ${colors.border}`, borderRadius: '12px !important', mb: 1.75,
                overflow: 'hidden', '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<AddIcon sx={{ color: colors.primary }} />}
                sx={{ px: 3, py: 0.5 }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '0.98rem' }}>{item.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 2.5 }}>
                <Typography sx={{ color: colors.textLight, fontSize: '0.92rem', lineHeight: 1.75 }}>{item.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

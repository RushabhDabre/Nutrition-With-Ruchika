import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { colors } from "../theme";
import SectionTitle from "./SectionTitle";
import { apiBaseUrl } from "../data/siteData";

const DEFAULT_FAQS = [
  {
    id: "f1",
    question: "Will I have to give up rice, roti, or everyday Indian home food?",
    answer:
      "Not at all. My philosophy is rooted in sustainable ghar ka khana. We optimize macronutrient ratios, portion sizes, and meal timing so you continue enjoying your family meals without guilt or starvation.",
  },
  {
    id: "f2",
    question: "How does the 1-on-1 consultation session work?",
    answer:
      "After selecting your preferred time slot and completing your intake, you'll receive an instant Google Meet link. In our 45-60 minute deep-dive, we analyze your health history, blood markers, lifestyle routine, and personal goals before formulating your roadmap.",
  },
  {
    id: "f3",
    question: "Can you help with PCOS, thyroid, or stubborn weight plateaus?",
    answer:
      "Yes! With a Master's degree in Pharmacology and clinical nutrition expertise, I specialize in reversing metabolic slowdown, improving insulin sensitivity for PCOS, and restoring gut-thyroid balance.",
  },
  {
    id: "f4",
    question: "Do I need to buy expensive supplements or meal replacement shakes?",
    answer:
      "No artificial powders or expensive fads. Over 95% of your nourishment comes directly from whole foods in your kitchen. Targeted vitamins are only suggested if blood tests show clear clinical deficiencies.",
  },
  {
    id: "f5",
    question: "How do we stay in touch after the consultation call?",
    answer:
      "You receive direct 1-on-1 WhatsApp support for meal logging feedback, restaurant navigation, travel modifications, and weekly progress check-ins so you are never left guessing.",
  },
];

export default function FAQ() {
  const [items, setItems] = useState(DEFAULT_FAQS);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/faqs`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data
            .filter((item) => item.active)
            .sort((a, b) => a.displayOrder - b.displayOrder);
          if (active.length > 0) setItems(active);
        }
      })
      .catch(() => setItems(DEFAULT_FAQS));
  }, []);

  const col1 = items.filter((_, idx) => idx % 2 === 0);
  const col2 = items.filter((_, idx) => idx % 2 !== 0);

  const renderAccordion = (item) => (
    <Accordion
      key={item.id}
      disableGutters
      elevation={0}
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: "14px !important",
        mb: 1.5,
        bgcolor: colors.bgWhite,
        overflow: "hidden",
        "&:before": { display: "none" },
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "rgba(30, 70, 32, 0.2)",
          boxShadow: "0 6px 16px -3px rgba(30, 70, 32, 0.06)",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<AddIcon sx={{ color: colors.primaryDark, fontSize: 20 }} />}
        sx={{ px: { xs: 2, sm: 2.5 }, py: 0.75, minHeight: 48 }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "0.94rem", color: colors.textDark, lineHeight: 1.35 }}>
          {item.question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2, sm: 2.5 }, pb: 2, pt: 0 }}>
        <Typography
          sx={{
            color: colors.textMuted,
            lineHeight: 1.6,
            fontSize: "0.86rem",
          }}
        >
          {item.answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box component="section" id="faq" sx={{ py: { xs: 6, md: 8 }, bgcolor: colors.bgSage, width: "100%" }}>
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about consultations, meal plans, and ongoing support"
          mb={{ xs: 2.5, md: 3 }}
        />
        <Box
          className="scrollable-content"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 0, md: 2.5 },
            alignItems: "start",
          }}
        >
          <Box>{col1.map(renderAccordion)}</Box>
          <Box>{col2.map(renderAccordion)}</Box>
        </Box>
      </Container>
    </Box>
  );
}

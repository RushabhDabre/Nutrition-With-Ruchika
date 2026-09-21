import React from "react";
import {
  Box,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { colors, serifFont } from "../theme";
import SectionTitle from "./SectionTitle";
import { apiBaseUrl } from "../data/siteData";

const defaultFaqs = [
  {
    id: "faq-1",
    question: "Do I have to follow extreme diets or give up my favorite foods?",
    answer:
      "Not at all. My philosophy is built on sustainable, balanced nutrition using everyday home-cooked meals (ghar ka khana). We make gradual, realistic adjustments that fit your lifestyle without strict restrictions or deprivation.",
    active: true,
  },
  {
    id: "faq-2",
    question: "Are your nutrition plans suitable for vegetarians and vegans?",
    answer:
      "Yes! Whether you are purely vegetarian, non-vegetarian, eggetarian, or vegan, every plan is tailored to your food preferences, culinary habits, and grocery routines.",
    active: true,
  },
  {
    id: "faq-3",
    question: "How do online consultations and regular follow-ups work?",
    answer:
      "Consultations take place via video call (Google Meet or Zoom). Between sessions, you get dedicated WhatsApp support and scheduled check-ins to review progress, adjust meals, and keep you accountable.",
    active: true,
  },
  {
    id: "faq-4",
    question: "Can this work if I have a demanding corporate or travel schedule?",
    answer:
      "Absolutely. Over 70% of my clients are busy professionals. We design practical eating strategies for office hours, dining out, and business travel so you stay consistent wherever you are.",
    active: true,
  },
];

export default function FAQ() {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    fetch(`${apiBaseUrl}/api/faqs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.filter((item) => item.active !== false));
        } else {
          setItems(defaultFaqs);
        }
      })
      .catch(() => setItems(defaultFaqs));
  }, []);

  const displayList = items.length > 0 ? items : defaultFaqs;

  return (
    <Box
      component="section"
      id="faq"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: colors.bgLight,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="md">
        <SectionTitle
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Answers to what clients ask most about consultations, meal plans, and results."
        />
        <Box>
          {displayList
            ?.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            ?.map((item) => (
              <Accordion
                key={item.id}
                disableGutters
                elevation={0}
                sx={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: "14px !important",
                  mb: 2,
                  bgcolor: colors.white,
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  "&:before": { display: "none" },
                  "&:hover": {
                    borderColor: colors.primary,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<AddIcon sx={{ color: colors.primary }} />}
                  sx={{ px: { xs: 3, sm: 4 }, py: 1 }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: serifFont,
                      fontSize: "1.08rem",
                      color: colors.textDark,
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 3, sm: 4 }, pb: 3, pt: 0 }}>
                  <Typography
                    sx={{
                      color: colors.textLight,
                      fontSize: "0.92rem",
                      lineHeight: 1.75,
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Container>
    </Box>
  );
}

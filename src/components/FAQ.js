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
import { colors } from "../theme";
import SectionTitle from "./SectionTitle";
import { apiBaseUrl } from "../data/siteData";

export default function FAQ() {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    fetch(`${apiBaseUrl}/api/faqs`)
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <Box component="section" id="faq" sx={{ py: 5, bgcolor: colors.bgLight, background: `linear-gradient( 180deg, rgba(245, 246, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%)`, }}>
      <Container maxWidth="md">
        <SectionTitle
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Answers to what clients ask me most"
        />
        <Box>
          {items
            ?.filter((item) => item.active)
            ?.sort((a, b) => a.displayOrder - b.displayOrder)
            ?.map((item) => (
              <Accordion
                key={item.id}
                disableGutters
                elevation={0}
                sx={{
                  border: `2px solid ${colors.border}`,
                  borderRadius: "12px !important",
                  mb: 1.75,
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<AddIcon sx={{ color: colors.primary }} />}
                  sx={{ px: 5, py: 0.5 }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: "0.98rem" }}>
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 5, pb: 2.5 }}>
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

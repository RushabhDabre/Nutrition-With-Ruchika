import React from "react";
import { Box, Button, Stack } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EventIcon from "@mui/icons-material/Event";
import { colors } from "../theme";
import { useBooking } from "../context/BookingContext";
import { useSiteContent } from "../context/SiteContentContext";
import { getWhatsAppUrl, trackWhatsAppClick } from "../utils/analytics";

export default function StickyMobileCTA() {
  const { openBooking, isOpen } = useBooking();
  const { contact } = useSiteContent();

  const whatsappLink = getWhatsAppUrl(
    contact.whatsappNumber,
    "Hi Dietitian Ruchika! I'm browsing your website on mobile and would like to know more about consultation and diet plans."
  );

  // Hide sticky bar when booking modal is open
  if (isOpen) return null;

  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1050,
        p: 1.5,
        bgcolor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 -8px 25px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Stack direction="row" spacing={1.5}>
        <Button
          fullWidth
          variant="contained"
          size="medium"
          onClick={openBooking}
          startIcon={<EventIcon sx={{ fontSize: "1.1rem" }} />}
          sx={{
            bgcolor: colors.primary,
            color: "#ffffff",
            fontWeight: 600,
            py: 1.1,
            fontSize: "0.85rem",
            borderRadius: "24px",
            boxShadow: "none",
            "&:hover": { bgcolor: colors.primaryDark, boxShadow: "none" },
          }}
        >
          Book Slot
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="medium"
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsAppClick("Mobile Sticky Bar")}
          startIcon={<WhatsAppIcon sx={{ fontSize: "1.1rem", color: colors.whatsapp }} />}
          sx={{
            borderColor: colors.border,
            bgcolor: "#ffffff",
            color: colors.textDark,
            fontWeight: 600,
            py: 1.1,
            fontSize: "0.85rem",
            borderRadius: "24px",
            "&:hover": {
              borderColor: colors.primary,
              bgcolor: colors.bgSage,
            },
          }}
        >
          WhatsApp
        </Button>
      </Stack>
    </Box>
  );
}

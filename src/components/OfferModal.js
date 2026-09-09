import React, { useEffect, useState, useCallback } from "react";
import { Dialog, Box, Typography, IconButton, Fab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { colors, gradientBrand } from "../theme";
import { apiBaseUrl } from "../data/siteData";

const SESSION_KEY = "dismissed_offer_modal_ids";
const AUTO_OPEN_DELAY_MS = 1500;

function getDismissedIds() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
  } catch {
    return [];
  }
}

function markDismissed(id) {
  const ids = getDismissedIds();
  if (!ids.includes(id)) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...ids, id]));
  }
}

export default function OfferModal() {
  const [offer, setOffer] = useState(null);
  const [open, setOpen] = useState(false);
  const [everShown, setEverShown] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/banners`)
      .then((res) => res.json())
      .then((data) => {
        const modalOffer = data.find((b) => b.displayType === "MODAL");
        if (!modalOffer) return;
        setOffer(modalOffer);

        if (!getDismissedIds().includes(modalOffer.id)) {
          const timer = setTimeout(() => {
            setOpen(true);
            setEverShown(true);
          }, AUTO_OPEN_DELAY_MS);
          return () => clearTimeout(timer);
        }
      })
      .catch(() => setOffer(null));
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (offer) markDismissed(offer.id);
  }, [offer]);

  const handleReopen = () => {
    setOpen(true);
    setEverShown(true);
  };

  if (!offer) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", overflow: "visible", m: 2 } }}
      >
        <Box
          sx={{
            position: "relative",
            p: { xs: 3, sm: 4 },
            textAlign: "center",
          }}
        >
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: colors.bgLight,
              "&:hover": { bgcolor: colors.border },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              mx: "auto",
              mb: 2,
              background: gradientBrand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
            }}
          >
            <LocalOfferIcon sx={{ color: colors.white, fontSize: "1.6rem" }} />
          </Box>

          <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 1 }}>
            {offer.title}
          </Typography>

          {offer.subtitle && (
            <Typography
              sx={{ color: colors.textLight, fontSize: "0.92rem", mb: 3 }}
            >
              {offer.subtitle}
            </Typography>
          )}

          {offer.linkUrl && (
            <Box
              component="a"
              href={offer.linkUrl}
              target="_blank"
              rel="noreferrer"
              onClick={handleClose}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                background: gradientBrand,
                color: colors.white,
                fontWeight: 700,
                fontSize: "0.92rem",
                px: 3,
                py: 1.2,
                borderRadius: "10px",
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              {offer.buttonText || "Claim Offer"}
              <ArrowForwardIcon sx={{ fontSize: "1rem" }} />
            </Box>
          )}
        </Box>
      </Dialog>

      {everShown && !open && (
        <Fab
          onClick={handleReopen}
          size="medium"
          sx={{
            position: "fixed",
            bottom: 28,
            left: 28,
            bgcolor: colors.white,
            color: colors.primary,
            border: `2px solid ${colors.primary}`,
            boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
            "&:hover": { bgcolor: colors.bgLight },
          }}
        >
          <LocalOfferIcon />
        </Fab>
      )}
    </>
  );
}

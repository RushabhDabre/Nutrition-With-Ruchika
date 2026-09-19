import React, { useEffect, useState, useCallback } from "react";
import { Dialog, Box, IconButton, Fab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { getLocalDateString } from "../helper/dateHelper";
import { colors } from "../theme";
import { apiBaseUrl } from "../data/siteData";

const AUTO_OPEN_DELAY_MS = 1500;

function isOfferCurrentlyActive(offer) {
  if (!offer?.active || !offer?.imageUrl) {
    return false;
  }
  const today = getLocalDateString();

  // Not started yet
  if (offer.startDate && today < offer.startDate) {
    return false;
  }

  // Already expired
  if (offer.endDate && today > offer.endDate) {
    return false;
  }

  return true;
}

export default function OfferModal() {
  const [offer, setOffer] = useState(null);
  const [open, setOpen] = useState(false);
  const [everShown, setEverShown] = useState(false);

  useEffect(() => {
    let timer;

    fetch(`${apiBaseUrl}/api/banners`)
      .then((res) => res.json())
      .then((data) => {
        const modalOffer = data
          .filter((b) => b.displayType === "MODAL" && isOfferCurrentlyActive(b))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        if (!modalOffer) return;

        setOffer(modalOffer);

        timer = setTimeout(() => {
          setOpen(true);
          setEverShown(true);
        }, AUTO_OPEN_DELAY_MS);
      })
      .catch((e) => {
        console.error(e.stack);
        setOffer(null);
      });

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleReopen = useCallback(() => {
    setOpen(true);
    setEverShown(true);
  }, []);

  if (!offer) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "visible",
            m: 2,
            bgcolor: "transparent",
            boxShadow: "none",
            width: {
              xs: "calc(100vw - 32px)",
              sm: "520px",
              md: "700px",
              // lg: "900px",
            },
            maxWidth: "95vw",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              position: "absolute",
              top: -14,
              right: -14,
              zIndex: 1,
              bgcolor: colors.white,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              "&:hover": { bgcolor: colors.bgLight },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box
            component="img"
            src={offer.imageUrl}
            alt={offer.title || "Offer"}
            sx={{
              display: "block",
              width: "100%",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          />
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

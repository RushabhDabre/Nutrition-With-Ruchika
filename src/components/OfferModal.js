import React, { useEffect, useState, useCallback, useRef } from "react";
import { Dialog, Box, IconButton, Fab, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { getLocalDateString } from "../helper/dateHelper";
import { colors, gradientBrand } from "../theme";
import { apiBaseUrl } from "../data/siteData";
import { useBooking } from "../context/BookingContext";
import ProgramEnrollModal from "./ProgramEnrollModal";

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
  const { isOpen: isBookingOpen, openBooking } = useBooking();
  const [offer, setOffer] = useState(null);
  const [open, setOpen] = useState(false);
  const [everShown, setEverShown] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);

  // Synchronous refs to prevent stale closures and extra effect runs
  const isBookingOpenRef = useRef(isBookingOpen);
  isBookingOpenRef.current = isBookingOpen;

  const wasBookingOpenRef = useRef(isBookingOpen);
  const hasAutoShownRef = useRef(false);
  const isImagePreloadedRef = useRef(false);
  const bannerDataRef = useRef(null);

  // Auto-close offer modal immediately whenever booking flow opens
  useEffect(() => {
    if (isBookingOpen && open) {
      setOpen(false);
    }
  }, [isBookingOpen, open]);

  // Central trigger to show the modal automatically (strictly once)
  const triggerAutoOpen = useCallback(() => {
    if (hasAutoShownRef.current) return;
    if (isBookingOpenRef.current) return;
    if (!bannerDataRef.current || !isImagePreloadedRef.current) return;

    hasAutoShownRef.current = true;
    setOpen(true);
    setEverShown(true);
  }, []);

  // Fetch active modal banner once on mount and preload the image asset
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
        bannerDataRef.current = modalOffer;

        if (modalOffer.imageUrl) {
          const preloader = new Image();
          preloader.src = modalOffer.imageUrl;

          const onReady = () => {
            isImagePreloadedRef.current = true;
            // Only auto-open if booking flow is NOT open and modal has never auto-opened yet
            if (!isBookingOpenRef.current && !hasAutoShownRef.current) {
              timer = setTimeout(triggerAutoOpen, 600);
            }
          };

          if (preloader.complete) {
            onReady();
          } else {
            preloader.onload = onReady;
            preloader.onerror = () => {
              console.warn("Banner image failed to load");
            };
          }
        }
      })
      .catch((e) => {
        console.error(e.stack);
        setOffer(null);
      });

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [triggerAutoOpen]);

  // Listen for booking dialog open/close state transitions
  useEffect(() => {
    const wasOpen = wasBookingOpenRef.current;
    wasBookingOpenRef.current = isBookingOpen;

    // Detect when the booking dialog is closed (wasOpen was true, now false)
    if (wasOpen && !isBookingOpen) {
      // If the offer modal was NEVER shown automatically yet (e.g. direct /book visit)
      // and image is ready, show it now after booking dialog fades out!
      if (!hasAutoShownRef.current && bannerDataRef.current && isImagePreloadedRef.current) {
        const timer = setTimeout(triggerAutoOpen, 350);
        return () => clearTimeout(timer);
      }
      // If hasAutoShownRef.current is true (e.g. was already shown at home),
      // we do nothing! Never show again.
    }
  }, [isBookingOpen, triggerAutoOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleReopen = useCallback(() => {
    setOpen(true);
    setEverShown(true);
  }, []);

  const handleActionClick = useCallback(() => {
    if (offer?.paymentRequired) {
      setOpen(false);
      setEnrollOpen(true);
    } else if (offer?.linkUrl && !offer.linkUrl.startsWith("#")) {
      window.open(offer.linkUrl, "_blank");
    } else {
      // Default / Book Now -> Direct consultation booking with zero lag
      setOpen(false);
      openBooking();
    }
  }, [offer, openBooking]);

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
            width: "auto",
            maxWidth: "95vw",
          },
        }}
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <IconButton
            onClick={handleClose}
            size="small"
            aria-label="Close offer"
            sx={{
              position: "absolute",
              top: -14,
              right: -14,
              zIndex: 10,
              bgcolor: colors.white,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              "&:hover": { bgcolor: colors.primarySubtle },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Banner image: rendered immediately when preloaded */}
          <Box
            component="img"
            src={offer.imageUrl}
            alt={offer.title || "Offer"}
            loading="eager"
            decoding="async"
            onClick={handleActionClick}
            sx={{
              display: "block",
              width: "100%",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              cursor: "pointer",
            }}
          />

          {/* Action button: rendered immediately with the banner image, zero delay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 32px)",
              maxWidth: 340,
              textAlign: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleActionClick}
              sx={{
                background: gradientBrand,
                color: colors.white,
                fontWeight: 800,
                fontSize: "1rem",
                py: 1.2,
                borderRadius: "30px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                textTransform: "none",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  opacity: 0.95,
                  transform: "scale(1.02)",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              {offer.buttonText ||
                (offer.paymentRequired
                  ? `Enroll Now${offer.priceInr ? ` · ₹${offer.priceInr}` : ""}`
                  : "Book Now")}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {offer.paymentRequired && (
        <ProgramEnrollModal
          open={enrollOpen}
          onClose={() => setEnrollOpen(false)}
          plan={{
            id: offer.id,
            isBanner: true,
            bannerId: offer.id,
            name: offer.title,
            priceInr: offer.priceInr,
            description: offer.subtitle,
          }}
        />
      )}

      {everShown && !open && !isBookingOpen && (
        <Fab
          onClick={handleReopen}
          size="medium"
          sx={{
            position: "fixed",
            bottom: 28,
            left: 28,
            bgcolor: colors.white,
            color: colors.primaryDark,
            border: `2px solid ${colors.primaryDark}`,
            boxShadow: "0 8px 20px rgba(56, 75, 50, 0.25)",
            "&:hover": { bgcolor: colors.primarySubtle },
          }}
        >
          <LocalOfferIcon />
        </Fab>
      )}
    </>
  );
}

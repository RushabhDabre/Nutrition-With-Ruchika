/**
 * Analytics and Tracking Helpers (Meta Pixel, Clarity, Google Analytics)
 */

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== "undefined") {
    // Meta / Facebook Pixel
    if (typeof window.fbq === "function") {
      try {
        window.fbq("track", eventName, params);
      } catch (e) {
        console.warn("Meta Pixel track error:", e);
      }
    }
    // Google Analytics (gtag)
    if (typeof window.gtag === "function") {
      try {
        window.gtag("event", eventName, params);
      } catch (e) {
        console.warn("GA4 track error:", e);
      }
    }
  }
};

/**
 * Builds a direct WhatsApp chat link with an optional prefilled prompt
 */
export const getWhatsAppUrl = (
  number,
  message = "Hi Dietitian Ruchika! I visited your website and would like to know more about consultation and diet plans."
) => {
  const cleanNumber = String(number || "919876543210").replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};

/**
 * Tracks WhatsApp link clicks as Contact / Lead events
 */
export const trackWhatsAppClick = (source = "General") => {
  trackEvent("Contact", {
    content_name: `WhatsApp Click - ${source}`,
  });
};

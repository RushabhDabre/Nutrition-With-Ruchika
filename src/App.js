import React, { useLayoutEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { BookingProvider } from "./context/BookingContext";
import { SiteContentProvider } from "./context/SiteContentContext";
import { FeedbackProvider } from "./context/FeedbackContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BannerStrip from "./components/BannerStrip";
import { KeyServicesStrip } from "./components/KeyServices";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import HealthTools from "./components/HealthTools";
// import Programs from "./components/Programs";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import { FinalCTA, Footer, WhatsAppFloat } from "./components/FooterSection";
import BookingFlow from "./components/BookingFlow";
import BookingErrorBoundary from "./components/BookingErrorBoundary";
import OfferModal from "./components/OfferModal";
import AdminDashboard from "./components/AdminDashboard";
import LegalPage from "./components/LegalPage";
import DietQuiz from "./components/DietQuiz";
import StickyMobileCTA from "./components/StickyMobileCTA";
import ValuePillars from "./components/ValuePillars";
import CustomPageScrollbar from "./components/CustomPageScrollbar";
import ScrollToTopButton from "./components/ScrollToTopButton";
import RevealOnScroll from "./components/RevealOnScroll";
import { colors } from "./theme";

function MainSite({ autoOpenBooking = false }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shouldAutoOpen =
    autoOpenBooking ||
    location.pathname === "/book" ||
    location.pathname === "/payment" ||
    location.pathname === "/consultation" ||
    location.pathname === "/book-now" ||
    searchParams.get("book") === "true" ||
    searchParams.get("payment") === "true";

  // Header + BannerStrip are combined into a single fixed stack (banner on
  // top, header below it). Since the banner can appear/disappear/rotate,
  // we measure the stack's real height and feed it to Hero so its top
  // padding always matches exactly - no guessing a fixed number that's
  // wrong whenever a banner is (or isn't) showing.
  const topBarRef = useRef(null);
  const [topOffset, setTopOffset] = useState(96);

  useLayoutEffect(() => {
    const el = topBarRef.current;
    if (!el) return undefined;
    const update = () => setTopOffset(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Natural fluid scrolling with smooth reveals
  return (
    <BookingProvider initialOpen={shouldAutoOpen}>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          backgroundColor: colors.bgCream,
        }}
      >
        <CustomPageScrollbar topOffset={topOffset} />
        <Box
          ref={topBarRef}
          sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100 }}
        >
          <BannerStrip />
          <Header />
        </Box>
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box id="home" sx={{ position: "relative" }}>
            <Hero topOffset={topOffset} />
          </Box>
          <RevealOnScroll sx={{ scrollMarginTop: `${topOffset}px` }}>
            <ValuePillars />
          </RevealOnScroll>
          <RevealOnScroll sx={{ scrollMarginTop: `${topOffset}px` }}>
            <KeyServicesStrip />
          </RevealOnScroll>
          <RevealOnScroll sx={{ scrollMarginTop: `${topOffset}px` }}>
            <About />
          </RevealOnScroll>
          <RevealOnScroll sx={{ scrollMarginTop: `${topOffset}px` }}>
            <DietQuiz />
          </RevealOnScroll>
          <RevealOnScroll sx={{ scrollMarginTop: `${topOffset}px` }}>
            <HowItWorks />
          </RevealOnScroll>
          <RevealOnScroll sx={{ scrollMarginTop: `${topOffset}px` }}>
            <Testimonials />
          </RevealOnScroll>
          <RevealOnScroll sx={{ scrollMarginTop: `${topOffset}px` }}>
            <HealthTools />
          </RevealOnScroll>
          <RevealOnScroll sx={{ scrollMarginTop: `${topOffset}px` }}>
            <FAQ />
          </RevealOnScroll>
          <RevealOnScroll sx={{ scrollMarginTop: `${topOffset}px` }}>
            <Contact />
          </RevealOnScroll>
          <RevealOnScroll sx={{ bgcolor: "#202E1F", scrollMarginTop: `${topOffset}px` }}>
            <FinalCTA />
          </RevealOnScroll>
          <Footer />
        </Box>
        <ScrollToTopButton />
        <WhatsAppFloat />
        <StickyMobileCTA />
        <BookingErrorBoundary>
          <BookingFlow />
        </BookingErrorBoundary>
        <OfferModal />
      </Box>
    </BookingProvider>
  );
}

function App() {
  return (
    <FeedbackProvider>
      <SiteContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainSite />} />
            <Route path="/book" element={<MainSite autoOpenBooking />} />
            <Route path="/payment" element={<MainSite autoOpenBooking />} />
            <Route path="/consultation" element={<MainSite autoOpenBooking />} />
            <Route path="/book-now" element={<MainSite autoOpenBooking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
            <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
            <Route path="/refund-policy" element={<LegalPage type="refund" />} />
            <Route path="/cancellation-refund-policy" element={<LegalPage type="refund" />} />
            <Route path="/disclaimer" element={<LegalPage type="disclaimer" />} />
            <Route path="*" element={<MainSite />} />
          </Routes>
        </BrowserRouter>
      </SiteContentProvider>
    </FeedbackProvider>
  );
}

export default App;

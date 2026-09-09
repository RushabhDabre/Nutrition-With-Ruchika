import React, { useLayoutEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { BookingProvider } from "./context/BookingContext";
import { SiteContentProvider } from "./context/SiteContentContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BannerStrip from "./components/BannerStrip";
import { KeyServicesStrip, WhyChooseMe } from "./components/KeyServices";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Services from "./components/Services";
import HealthTools from "./components/HealthTools";
// import Programs from "./components/Programs";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import { FinalCTA, Footer, WhatsAppFloat } from "./components/FooterSection";
import BookingFlow from "./components/BookingFlow";
import OfferModal from './components/OfferModal';
import AdminDashboard from "./components/AdminDashboard";

function MainSite() {
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

  return (
    <BookingProvider>
      <Box
        ref={topBarRef}
        sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100 }}
      >
        <BannerStrip />
        <Header />
      </Box>
      <Hero topOffset={topOffset} />
      <KeyServicesStrip />
      <WhyChooseMe />
      <HowItWorks />
      <Testimonials />
      <About />
      <Services />
      <HealthTools />
      {/* <Programs /> */}
      <Contact />
      <FAQ />
      <FinalCTA />
      <Footer />
      <WhatsAppFloat />
      <BookingFlow />
      <OfferModal />
    </BookingProvider>
  );
}

function App() {
  return (
    <SiteContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </SiteContentProvider>
  );
}

export default App;

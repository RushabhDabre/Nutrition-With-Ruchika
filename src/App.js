import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { SiteContentProvider } from './context/SiteContentContext';
import Header from './components/Header';
import Hero from './components/Hero';
import BannerStrip from './components/BannerStrip';
import { KeyServicesStrip, WhyChooseMe } from './components/KeyServices';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Services from './components/Services';
import Programs from './components/Programs';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import { FinalCTA, Footer, WhatsAppFloat } from './components/FooterSection';
import BookingFlow from './components/BookingFlow';
import AdminDashboard from './components/AdminDashboard';

function MainSite() {
  return (
    <BookingProvider>
      <Header />
      <Hero />
      <BannerStrip />
      <KeyServicesStrip />
      <WhyChooseMe />
      <Testimonials />
      <About />
      <Services />
      <Programs />
      <Contact />
      <FAQ />
      <FinalCTA />
      <Footer />
      <WhatsAppFloat />
      <BookingFlow />
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

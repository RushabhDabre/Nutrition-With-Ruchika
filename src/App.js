import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import { KeyServicesStrip, WhyChooseMe } from './components/KeyServices';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Services from './components/Services';
import Programs from './components/Programs';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import { FinalCTA, Footer, WhatsAppFloat } from './components/FooterSection';

function App() {
  return (
    <>
      <Header />
      <Hero />
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
    </>
  );
}

export default App;

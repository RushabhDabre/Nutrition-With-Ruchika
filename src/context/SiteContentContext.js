import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiBaseUrl } from '../data/siteData';

const SiteContentContext = createContext(null);

// Keep this in sync with SiteSettingsService.DEFAULT_CONTENT on the backend.
// Used if the backend is briefly unreachable, so the site never renders blank.
const FALLBACK_CONTENT = {
  contact: {
    whatsappNumber: '919876543210',
    instagramHandle: '@nutritionwithruchika',
    instagramUrl: 'https://instagram.com/nutritionwithruchika',
    email: 'ruchika@nutritionwithruchika.com',
    officeHours: 'Mon-Sat: 10 AM - 6 PM IST',
  },
  hero: {
    headline: 'Eat Better. Feel Better.',
    headlineHighlight: 'Live Better.',
    tagline: 'Personalized, science-backed nutrition plans that fit your lifestyle — not the other way around.',
  },
  about: {
    intro: "I'm a certified nutritionist and dietitian passionate about helping people build a healthy relationship with food.",
    background: 'Over 8 years of clinical and private practice experience, working with 500+ clients.',
  },
  consultationFeeInr: 99,
};

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    return fetch(`${apiBaseUrl}/api/site-settings`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load site content');
        return res.json();
      })
      .then((data) => setContent(data))
      .catch(() => setContent(FALLBACK_CONTENT))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, loading, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
}

/** Returns just the content object - what most components need. */
export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used within a SiteContentProvider');
  return ctx.content;
}

/** Returns the full context (content + loading + refresh) - used by the admin editor. */
export function useSiteContentAdmin() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContentAdmin must be used within a SiteContentProvider');
  return ctx;
}

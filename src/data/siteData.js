// export const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

export const aboutStatic = {
  education: [
    "M.Pharm in Pharmacology",
    "Diploma in Nutrition & Dietetics",
    "7 years of professional experience in the corporate healthcare industry",
  ],
  approach: [
    "Personalized nutrition plans that fit your routine",
    "Sustainable habits over restrictive or complicated diets",
    "Practical nutrition using everyday ghar ka khana",
    "Simple, realistic guidance for busy working professionals",
    "Education and guidance focused on long-term lifestyle change",
  ],
};

export const pricingPlans = [
  {
    name: "Starter Program",
    desc: "Best for quick, focused goals",
    price: "₹5,999",
    period: "30 days",
    featured: false,
    features: [
      "Personalized diet plan",
      "1 detailed consultation call",
      "2 follow-up check-ins",
      "WhatsApp support (business hours)",
      "Diet plan revisions as needed",
    ],
  },
  {
    name: "Transformation Program",
    desc: "Best for real, lasting results",
    price: "₹14,999",
    period: "100 days",
    featured: true,
    badge: "Most Popular",
    features: [
      "Everything in Starter, plus:",
      "Fully personalized diet plan (updated monthly)",
      "Weekly follow-up check-ins",
      "Priority WhatsApp support (daily)",
      "Lab report review & guidance",
      "Lifestyle & exercise guidance",
    ],
  },
  {
    name: "Ongoing Wellness",
    desc: "Best for long-term maintenance",
    price: "₹8,999",
    period: "per month",
    featured: false,
    features: [
      "Monthly plan updates",
      "2 check-ins per month",
      "WhatsApp support",
      "Festival/travel diet adjustments",
      "Cancel anytime",
    ],
  },
];

export const concernOptions = [
  "Weight Management",
  "PCOS",
  "Diabetes / Prediabetes",
  "Thyroid",
  "Fatty Liver",
  "Women's Nutrition",
  "Kids Nutrition",
  "Postpartum",
  "Other",
];

// ===== Booking Flow Config =====
export const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const dietTypeOptions = [
  "Vegetarian",
  "Non-Vegetarian",
  "Eggetarian",
  "Vegan",
];

// export const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

export const keyServices = [
  { icon: "⚖️", name: "Weight Management" },
  { icon: "🌸", name: "PCOS Care" },
  { icon: "🩺", name: "Diabetes Control" },
  { icon: "🦋", name: "Thyroid Support" },
  { icon: "🫁", name: "Fatty Liver" },
  { icon: "👩", name: "Women's Nutrition" },
];

export const whyChooseMe = [
  {
    icon: "🎯",
    title: "100% Personalized Plans",
    text: "No generic templates — every plan is built around your body, routine, and food preferences.",
  },
  {
    icon: "🔬",
    title: "Science-Backed Approach",
    text: "Evidence-based nutrition science, not fad diets or unsustainable restrictions.",
  },
  {
    icon: "💬",
    title: "Ongoing Support",
    text: "Regular check-ins and WhatsApp support to keep you motivated and on track.",
  },
  {
    icon: "🍛",
    title: "Real, Indian Food Plans",
    text: "Practical meal plans using everyday, accessible foods — not exotic ingredients.",
  },
];

export const aboutStatic = {
  education: [
    "M.Sc. in Clinical Nutrition & Dietetics",
    "Registered Dietitian Nutritionist (RDN)",
    "Certified in Diabetes & PCOS Nutrition Management",
  ],
  approach: [
    "Personalized plans — never one-size-fits-all",
    "Sustainable habits over short-term restriction",
    "Regular follow-ups to adjust and improve the plan",
    'Education-first, so you understand the "why"',
  ],
};

export const services = [
  {
    icon: "⚖️",
    title: "Weight Management",
    text: "Sustainable weight loss or gain plans built around your metabolism and lifestyle.",
    tags: ["Fat Loss", "Muscle Gain"],
  },
  {
    icon: "🌸",
    title: "PCOS Management",
    text: "Hormone-friendly nutrition to manage PCOS symptoms and improve cycle regularity.",
    tags: ["Hormonal Balance", "Insulin Resistance"],
  },
  {
    icon: "🩺",
    title: "Diabetes / Prediabetes",
    text: "Blood-sugar-friendly meal plans to help manage or reverse prediabetes and diabetes.",
    tags: ["Blood Sugar Control", "HbA1c"],
  },
  {
    icon: "🦋",
    title: "Thyroid Support",
    text: "Nutrition strategies to support thyroid function alongside your treatment plan.",
    tags: ["Hypothyroid", "Metabolism"],
  },
  {
    icon: "🫁",
    title: "Fatty Liver",
    text: "Liver-friendly nutrition plans to help reduce fat accumulation and improve liver health.",
    tags: ["NAFLD", "Detox Support"],
  },
  {
    icon: "👩",
    title: "Women's Nutrition",
    text: "Nutrition support through every life stage — periods, fertility, pregnancy, and menopause.",
    tags: ["Hormonal Health", "Fertility"],
  },
  {
    icon: "🧒",
    title: "Kids Nutrition",
    text: "Growth-focused, kid-friendly meal plans to build healthy eating habits early on.",
    tags: ["Growth", "Picky Eaters"],
  },
  {
    icon: "🤱",
    title: "Postpartum Nutrition",
    text: "Recovery-focused nutrition for new mothers balancing healing, energy, and weight goals.",
    tags: ["Recovery", "Lactation Support"],
  },
];

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

export const faqs = [
  {
    q: "How does the online consultation process work?",
    a: "After you book, we schedule a video/phone consultation where I understand your health history, lifestyle, and goals. Based on that, I create your personalized plan within 2-3 days.",
  },
  {
    q: "Do I need to follow a strict diet?",
    a: "No — my plans are built around foods you already eat and enjoy. The goal is sustainable change, not extreme restriction.",
  },
  {
    q: "How soon will I see results?",
    a: "Most clients notice improvements in energy and digestion within 2-3 weeks. Visible weight/health changes typically show in 4-6 weeks, depending on your starting point and consistency.",
  },
  {
    q: "Do you provide support for medical conditions like PCOS or diabetes?",
    a: "Yes, I specialize in nutrition support for PCOS, diabetes, thyroid, and fatty liver — always working alongside your doctor's treatment, not replacing it.",
  },
  {
    q: "Can I get support over WhatsApp?",
    a: "Yes, all programs include WhatsApp support so you can ask questions and get quick guidance between check-ins.",
  },
  {
    q: "What if I travel a lot or eat out frequently?",
    a: "No problem — I build flexible plans with restaurant/travel-friendly guidance so you can stay on track anywhere.",
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

export const consultationFee = 99; // must match backend CONSULTATION_FEE_INR

export const dietTypeOptions = [
  "Vegetarian",
  "Non-Vegetarian",
  "Eggetarian",
  "Vegan",
];

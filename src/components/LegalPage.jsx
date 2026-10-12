import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import { colors, gradientBrand } from "../theme";
import { useSiteContent } from "../context/SiteContentContext";
import { Footer } from "./FooterSection";

export default function LegalPage({ type }) {
  const { contact } = useSiteContent();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const policies = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "Last Updated: October 2026",
      icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 36, color: colors.primary }} />,
      content: (
        <>
          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 2 }}>
            1. Introduction
          </Typography>
          <Typography paragraph color="text.secondary">
            Welcome to <strong>Nutrition with Ruchika</strong> ("we", "our", or "us"). We are committed to protecting the privacy, confidentiality, and security of your personal and health-related information. This Privacy Policy outlines our practices regarding the collection, use, disclosure, and protection of information obtained through our website and consultation services.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            2. Information We Collect
          </Typography>
          <Typography paragraph color="text.secondary">
            To provide accurate, personalized dietary guidance, we collect:
          </Typography>
          <Box component="ul" sx={{ color: "text.secondary", pl: 3, mb: 2 }}>
            <li><strong>Contact Details:</strong> Full Name, Email Address, WhatsApp/Phone Number, City.</li>
            <li><strong>Biometric & Health Profile:</strong> Age, Gender, Height, Weight, Dietary Preferences (Veg/Non-Veg/Jain), Lifestyle Goals.</li>
            <li><strong>Clinical & Medical Data:</strong> Current medications, existing medical conditions (e.g., PCOS, Diabetes, Thyroid), which you voluntarily provide during the booking intake or consultation call.</li>
          </Box>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            3. How We Use Your Information
          </Typography>
          <Box component="ul" sx={{ color: "text.secondary", pl: 3, mb: 2 }}>
            <li>To evaluate your nutritional requirements and design customized diet plans.</li>
            <li>To schedule, confirm, and provide reminder notifications for your consultation calls via Email and WhatsApp.</li>
            <li>To maintain your consultation history and track progress across sessions.</li>
            <li>We <strong>do not sell, rent, or trade</strong> your personal or health data to third-party marketers or advertisers under any circumstances.</li>
          </Box>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            4. Payment Processing & Security
          </Typography>
          <Typography paragraph color="text.secondary">
            All online transactions on our platform are processed securely through <strong>Razorpay</strong>, our trusted payment gateway partner. Razorpay is certified PCI-DSS compliant.
          </Typography>
          <Typography paragraph color="text.secondary">
            <strong>We do not store or process your credit/debit card numbers, CVV, Net Banking credentials, or UPI PINs on our servers.</strong> All payment processing occurs directly over encrypted SSL/TLS channels via Razorpay.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            5. Third-Party Integrations
          </Typography>
          <Typography paragraph color="text.secondary">
            We work with trusted industry-standard infrastructure providers to deliver our services:
          </Typography>
          <Box component="ul" sx={{ color: "text.secondary", pl: 3, mb: 2 }}>
            <li><strong>Razorpay:</strong> Payment processing and invoice generation.</li>
            <li><strong>Brevo (Sendinblue):</strong> Automated transactional email confirmations with calendar invites.</li>
            <li><strong>Meta WhatsApp Cloud API:</strong> Appointment notifications and delivery updates.</li>
            <li><strong>Google Meet:</strong> Secure video consultation sessions.</li>
          </Box>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            6. Data Retention & Your Rights
          </Typography>
          <Typography paragraph color="text.secondary">
            Your intake details and consultation notes are retained to ensure continuity of your nutritional care. You retain the right to request a copy of your personal data or request the permanent deletion of your intake records by emailing us at <strong>{contact?.email || "nutritionwithruchika269@gmail.com"}</strong>.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            7. Grievance Officer & Contact Information
          </Typography>
          <Typography paragraph color="text.secondary">
            In accordance with the Information Technology Act 2000 and consumer protection guidelines, if you have any questions or complaints regarding this Privacy Policy, please contact:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
            <Typography variant="body2"><strong>Practitioner:</strong> Nutrition with Ruchika</Typography>
            <Typography variant="body2"><strong>Email:</strong> {contact?.email || "nutritionwithruchika269@gmail.com"}</Typography>
            <Typography variant="body2"><strong>WhatsApp / Phone:</strong> +{contact?.whatsappNumber || "919637150197"}</Typography>
            <Typography variant="body2"><strong>Working Hours:</strong> Mon - Sat: 10:00 AM - 6:00 PM IST</Typography>
          </Paper>
        </>
      ),
    },

    terms: {
      title: "Terms and Conditions",
      subtitle: "Last Updated: October 2026",
      icon: <GavelOutlinedIcon sx={{ fontSize: 36, color: colors.primary }} />,
      content: (
        <>
          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 2 }}>
            1. Agreement to Terms
          </Typography>
          <Typography paragraph color="text.secondary">
            By accessing our website and booking a consultation or dietary program with <strong>Nutrition with Ruchika</strong>, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our services.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            2. Scope of Services
          </Typography>
          <Typography paragraph color="text.secondary">
            Nutrition with Ruchika provides personalized dietary consultation, meal planning, and lifestyle wellness counseling. 
          </Typography>
          <Typography paragraph color="text.secondary">
            <strong>Important Medical Disclaimer:</strong> The dietary plans, wellness suggestions, and consultations provided are intended solely for educational, lifestyle, and nutritional guidance. They do not constitute formal medical diagnosis, pharmacotherapy, or prescription of pharmaceuticals. Clients with acute or critical medical conditions must consult a licensed medical physician before initiating drastic dietary changes.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            3. Client Responsibilities & Accurate Information
          </Typography>
          <Typography paragraph color="text.secondary">
            You agree to provide true, accurate, and complete information regarding your health, weight, medical conditions, and current medications during the intake form and video consultation. We are not liable for adverse results stemming from undisclosed medical conditions or food allergies.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            4. Appointment Bookings & Meeting Punctuality
          </Typography>
          <Box component="ul" sx={{ color: "text.secondary", pl: 3, mb: 2 }}>
            <li>Consultations are conducted online via Google Meet. A direct join link is delivered in your confirmation email.</li>
            <li>Consultations begin promptly at the scheduled time. If a client is late by more than 15 minutes without prior notice, the session may be deemed a "No-Show".</li>
            <li>Appointments may be rescheduled once without penalty if requested at least 12 hours prior to the scheduled slot.</li>
          </Box>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            5. Intellectual Property
          </Typography>
          <Typography paragraph color="text.secondary">
            All meal plans, custom recipes, dietary guides, and educational materials provided to you are proprietary property of Nutrition with Ruchika. They are licensed for your individual personal use only and may not be copied, distributed, or resold.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            6. Governing Law & Jurisdiction
          </Typography>
          <Typography paragraph color="text.secondary">
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these services shall be subject to the exclusive jurisdiction of the competent courts in India.
          </Typography>
        </>
      ),
    },

    refund: {
      title: "Cancellation and Refund Policy",
      subtitle: "Last Updated: October 2026",
      icon: <CurrencyExchangeOutlinedIcon sx={{ fontSize: 36, color: colors.primary }} />,
      content: (
        <>
          <Typography paragraph color="text.secondary" sx={{ mt: 2 }}>
            At <strong>Nutrition with Ruchika</strong>, we dedicate specific time and personalized preparation for each client. We believe in complete transparency regarding our cancellation and refund policies.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            1. Consultation Rescheduling
          </Typography>
          <Typography paragraph color="text.secondary">
            We understand unexpected schedule conflicts arise. You may reschedule your consultation up to <strong>12 hours</strong> prior to your booked slot without any penalty or fee. Please email or WhatsApp us with your booking ID to select an alternative available slot.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            2. Cancellation & Refund Eligibility
          </Typography>
          <Box component="ul" sx={{ color: "text.secondary", pl: 3, mb: 2 }}>
            <li>
              <strong>Cancellation > 12 Hours in Advance:</strong> If you cancel your consultation at least 12 hours before the scheduled appointment time, you are eligible for a <strong>100% full refund</strong>.
            </li>
            <li>
              <strong>Cancellation &lt; 12 Hours or No-Show:</strong> Because the dietitian's schedule was exclusively reserved and other clients were turned away, appointments cancelled with less than 12 hours notice, or instances where the client fails to attend the scheduled call ("No-Show"), are <strong>non-refundable</strong>.
            </li>
            <li>
              <strong>Completed Sessions & Custom Plans:</strong> Once the 1-on-1 consultation call has taken place or customized dietary plans have been delivered to you, services are considered fully delivered and are <strong>strictly non-refundable</strong>.
            </li>
          </Box>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            3. Refund Processing Timeline
          </Typography>
          <Typography paragraph color="text.secondary">
            Approved refunds will be initiated through our payment partner (<strong>Razorpay</strong>) within <strong>2 business days</strong> of approval. The refunded amount will be credited back to your original source of payment (Credit/Debit Card, UPI, or Net Banking) within <strong>5 to 7 business days</strong>, depending on your issuing bank.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            4. How to Request a Cancellation or Refund
          </Typography>
          <Typography paragraph color="text.secondary">
            To cancel a booking or request an approved refund, please email us at <strong>{contact?.email || "nutritionwithruchika269@gmail.com"}</strong> or contact us via WhatsApp at <strong>+{contact?.whatsappNumber || "919637150197"}</strong> with your Booking Order ID and registered phone number.
          </Typography>
        </>
      ),
    },

    disclaimer: {
      title: "Medical & Health Disclaimer",
      subtitle: "Last Updated: October 2026",
      icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 36, color: colors.primary }} />,
      content: (
        <>
          <Typography paragraph color="text.secondary" sx={{ mt: 2 }}>
            The content, consultations, meal charts, and dietary guidance provided by <strong>Nutrition with Ruchika</strong> are designed for general health, nutrition education, and wellness optimization purposes only.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            1. Not a Substitute for Medical Care
          </Typography>
          <Typography paragraph color="text.secondary">
            Ruchika is a qualified nutritionist and dietitian with a scientific background in pharmacology. However, consultations and dietary guidance provided through this platform do <strong>not</strong> constitute medical advice, medical diagnosis, or medical treatment.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            2. Medical Supervisions & Chronic Conditions
          </Typography>
          <Typography paragraph color="text.secondary">
            If you have acute medical conditions, are pregnant or lactating, have renal or cardiovascular disease, type 1 diabetes, or are taking prescription pharmaceuticals, you must seek the advice of your personal physician or specialized medical provider before undertaking dietary modifications. Never disregard professional medical advice or delay seeking it because of information discussed during a dietary consultation.
          </Typography>

          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mt: 3 }}>
            3. Individual Variations & Results
          </Typography>
          <Typography paragraph color="text.secondary">
            Every human metabolism, genetics, lifestyle, and adherence level is unique. Testimonials, past client case studies, and weight management examples displayed on this website represent individual experiences and do not constitute a guarantee of identical results for every client.
          </Typography>
        </>
      ),
    },
  };

  const currentPolicy = policies[type] || policies.privacy;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Top Header Bar */}
      <Box sx={{ bgcolor: "#ffffff", borderBottom: "1px solid #e2e8f0", py: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src="/assets/images/NutritionWithRuchikaLogo.png"
                alt="Nutrition with Ruchika"
                sx={{ height: 42, width: "auto" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <Typography
                variant="h6"
                fontWeight="800"
                sx={{
                  background: gradientBrand,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  ml: 1,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Nutrition with Ruchika
              </Typography>
            </Link>

            <Button
              component={Link}
              to="/"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderColor: "#cbd5e1",
                color: colors.textDark,
                "&:hover": { borderColor: colors.primary, bgcolor: "#f1f5f9" },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="md" sx={{ py: 6, flexGrow: 1 }}>
        <Breadcrumbs sx={{ mb: 3, fontSize: "0.85rem" }}>
          <Link to="/" style={{ color: "#64748b", textDecoration: "none" }}>
            Home
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "inherit", fontWeight: 600 }}>
            {currentPolicy.title}
          </Typography>
        </Breadcrumbs>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            {currentPolicy.icon}
            <Box>
              <Typography variant="h4" fontWeight="800" sx={{ color: colors.textDark }}>
                {currentPolicy.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="500">
                {currentPolicy.subtitle}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ "& p": { lineHeight: 1.8 } }}>
            {currentPolicy.content}
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { colors, serifFont } from "../theme";
import { concernOptions } from "../data/siteData";
import { useSiteContent } from "../context/SiteContentContext";
import SectionTitle from "./SectionTitle";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  concern: "",
  message: "",
};

function ContactCard({ icon, iconBg, title, subtitle, href }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        display: "flex",
        gap: 2,
        alignItems: "center",
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        transition: "all 0.3s ease",
        textDecoration: "none",
        color: "inherit",
        cursor: href ? "pointer" : "default",
        bgcolor: colors.white,
        "&:hover": href
          ? {
              borderColor: colors.primary,
              transform: "translateX(6px)",
              boxShadow: "0 10px 24px rgba(121, 152, 91, 0.12)",
            }
          : {},
      }}
      component={href ? "a" : "div"}
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noreferrer" : undefined}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          flexShrink: 0,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.white,
          fontSize: "1.25rem",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: colors.textDark,
            mb: 0.25,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ color: colors.textLight, fontSize: "0.86rem" }}>
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function Contact() {
  const { contact } = useSiteContent();
  const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Consultation request:", form);
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="Get In Touch"
          title="Book Your Consultation"
          subtitle="Fill out the form below or reach out directly — I typically respond within 24 hours."
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            gap: { xs: 5, md: 6 },
          }}
        >
          <Box sx={{ display: "grid", gap: 2 }}>
            <ContactCard
              icon={<WhatsAppIcon />}
              iconBg={colors.whatsapp}
              title="WhatsApp"
              subtitle={`+91 ${contact.whatsappNumber.slice(2)} — fastest way to reach me`}
              href={whatsappLink}
            />
            <ContactCard
              icon={<InstagramIcon />}
              iconBg="linear-gradient(135deg,#f09433,#dc2743,#bc1888)"
              title="Instagram"
              subtitle={contact.instagramHandle}
              href={contact.instagramUrl}
            />
            <ContactCard
              icon={<EmailIcon />}
              iconBg={colors.primary}
              title="Email"
              subtitle={contact.email}
              href={`mailto:${contact.email}`}
            />
            <ContactCard
              icon={<AccessTimeIcon />}
              iconBg={colors.forest}
              title="Office Hours"
              subtitle={contact.officeHours}
            />
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4.5 },
              border: `1px solid ${colors.border}`,
              borderRadius: "20px",
              bgcolor: colors.white,
              boxShadow: "0 14px 35px rgba(0,0,0,0.03)",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: serifFont,
                fontSize: "1.45rem",
                fontWeight: 600,
                color: colors.textDark,
                mb: 0.75,
              }}
            >
              Request a Free 15-min Discovery Call
            </Typography>
            <Typography
              sx={{ color: colors.textLight, mb: 3.25, fontSize: "0.9rem" }}
            >
              Tell me a bit about your goals and I'll get back to you shortly
            </Typography>

            {submitted && (
              <Alert severity="success" sx={{ mb: 2.5, borderRadius: 3 }}>
                Thank you! I'll get back to you within 24 hours.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                  mb: 2.25,
                }}
              >
                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  fullWidth
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  fullWidth
                />
              </Box>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                fullWidth
                sx={{ mb: 2.25 }}
              />
              <TextField
                select
                label="Area of Concern"
                name="concern"
                value={form.concern}
                onChange={handleChange}
                required
                fullWidth
                sx={{ mb: 2.25 }}
              >
                {concernOptions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Tell me about your goals"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="A little about what you're looking for..."
                multiline
                rows={3}
                fullWidth
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  bgcolor: colors.primary,
                  py: 1.5,
                  borderRadius: 50,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  boxShadow: "0 6px 20px rgba(121, 152, 91, 0.3)",
                  "&:hover": {
                    bgcolor: colors.primaryDark,
                  },
                }}
              >
                Request Consultation →
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

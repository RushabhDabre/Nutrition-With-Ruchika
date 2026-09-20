import React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { colors } from "../theme";
import { aboutStatic } from "../data/siteData";
import { useSiteContent } from "../context/SiteContentContext";

function AboutBlock({ icon, title, children }) {
  return (
    <Box sx={{ mb: 3.25 }}>
      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: 700,
          mb: 1.25,
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            bgcolor: "rgba(99,102,241,0.1)",
            color: colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
          }}
        >
          {icon}
        </Box>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function CheckList({ items }) {
  return (
    <List dense disablePadding>
      {items.map((item) => (
        <ListItem key={item} disableGutters sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 26 }}>
            <CheckCircleIcon sx={{ fontSize: "1rem", color: colors.success }} />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              fontSize: "0.95rem",
              color: colors.textLight,
            }}
            primary={item}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default function About() {
  const { about } = useSiteContent();

  return (
    <Box component="section" id="about" sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            gap: 7.5,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
              borderRadius: "20px",
              aspectRatio: "3/4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 25px 55px rgba(99,102,241,0.2)",
              overflow: "hidden",
            }}
          >
            {about.photoUrl ? (
              <Box
                component="img"
                src={about.photoUrl}
                alt="Ruchika"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography sx={{ fontSize: "4.5rem" }}>👩‍⚕️</Typography>
            )}
          </Box>

          <Box>
            <Chip
              label="About Me"
              sx={{
                bgcolor: "rgba(99,102,241,0.1)",
                color: colors.primary,
                fontWeight: 700,
                mb: 1.5,
                px: 1,
              }}
            />
            <Typography variant="h2" sx={{ fontSize: "2.3rem", mb: 2.5 }}>
              Hi, I'm Ruchika
            </Typography>
            <Typography
              sx={{ color: colors.textLight, mb: 2.25, lineHeight: 1.85 }}
            >
              {about.intro}
            </Typography>

            <AboutBlock icon="🎓" title="Education & Certifications">
              <CheckList items={aboutStatic.education} />
            </AboutBlock>

            <AboutBlock icon="📖" title="Background">
              <Typography sx={{ color: colors.textLight, lineHeight: 1.85 }}>
                {about.background}
              </Typography>
            </AboutBlock>

            <AboutBlock icon="💡" title="My Approach">
              <CheckList items={aboutStatic.approach} />
            </AboutBlock>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

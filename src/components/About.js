import React from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { colors, serifFont } from "../theme";
import { aboutStatic } from "../data/siteData";
import { useSiteContent } from "../context/SiteContentContext";

function AboutBlock({ icon, title, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{
          fontSize: "1.05rem",
          fontWeight: 600,
          fontFamily: serifFont,
          color: colors.textDark,
          mb: 1.25,
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "rgba(121, 152, 91, 0.12)",
            color: colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.95rem",
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
        <ListItem key={item} disableGutters sx={{ py: 0.6 }}>
          <ListItemIcon sx={{ minWidth: 26 }}>
            <CheckCircleIcon sx={{ fontSize: "1rem", color: colors.primary }} />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              fontSize: "0.92rem",
              color: colors.textLight,
              lineHeight: 1.6,
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
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: colors.bgLight,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.85fr 1.15fr" },
            gap: { xs: 5, md: 8 },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: "24px",
              aspectRatio: "3/4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 20px 45px rgba(27, 36, 25, 0.08)",
              border: `1px solid ${colors.border}`,
              bgcolor: "#ffffff",
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
              <Box
                component="img"
                src="/assets/images/profilePhoto.jpg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                alt="Dietitian Ruchika"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </Box>

          {/* Bio and Narrative */}
          <Box>
            <Typography
              sx={{
                color: colors.primary,
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              About Me
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontFamily: serifFont,
                fontSize: { xs: "2.2rem", md: "2.8rem" },
                fontWeight: 600,
                color: colors.textDark,
                mb: 2.5,
                lineHeight: 1.2,
              }}
            >
              Hi, I'm Ruchika
            </Typography>

            <Typography
              sx={{
                color: colors.textLight,
                mb: 3,
                lineHeight: 1.8,
                fontSize: "0.98rem",
              }}
            >
              {about.intro ||
                "I am a certified Clinical Nutritionist and Dietitian committed to making healthy eating simple, enjoyable, and permanently sustainable for everyday life."}
            </Typography>

            <AboutBlock icon="🎓" title="Education & Certifications">
              <CheckList items={aboutStatic.education} />
            </AboutBlock>

            <AboutBlock icon="📖" title="Background">
              <Typography
                sx={{ color: colors.textLight, lineHeight: 1.75, fontSize: "0.92rem" }}
              >
                {about.background}
              </Typography>
            </AboutBlock>

            <AboutBlock icon="🌱" title="My Approach">
              <CheckList items={aboutStatic.approach} />
            </AboutBlock>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

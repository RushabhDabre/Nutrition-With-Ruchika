import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { colors, gradientBrand, serifFont } from "../theme";
import { pricingPlans } from "../data/siteData";
import SectionTitle from "./SectionTitle";
import { useBooking } from "../context/BookingContext";

const programCards = [
  {
    id: "weight-loss",
    title: "Weight Loss Coaching",
    desc: "Sustainable weight loss through balanced nutrition and healthy habits.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "/assets/images/program-weight-loss.jpg",
  },
  {
    id: "sports-nutrition",
    title: "Sports Nutrition",
    desc: "Optimize performance and recovery with personalized nutrition strategies.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "/assets/images/program-sports.jpg",
  },
  {
    id: "healthy-lifestyle",
    title: "Healthy Lifestyle",
    desc: "Build a healthier relationship with food and create lasting lifestyle changes.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "/assets/images/program-lifestyle.jpg",
  },
];

export default function Programs() {
  const { openBooking } = useBooking();
  const [plansModalOpen, setPlansModalOpen] = useState(false);

  const handleOpenPlans = () => {
    setPlansModalOpen(true);
  };

  const handleClosePlans = () => {
    setPlansModalOpen(false);
  };

  const handleChoosePlan = () => {
    setPlansModalOpen(false);
    openBooking();
  };

  return (
    <Box
      component="section"
      id="programs"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: colors.bgLight,
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          eyebrow="Programs & Pricing"
          title="Choose Your Program"
          subtitle="Transparent pricing, no hidden costs — pick the plan that fits your goals"
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "320px 1fr" },
            gap: { xs: 5, lg: 6 },
            alignItems: "start",
          }}
        >
          {/* Left Column: Heading & CTA */}
          <Box sx={{ pr: { lg: 2 } }}>
            <Typography
              sx={{
                color: colors.primary,
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                mb: 1.75,
              }}
            >
              Programs
            </Typography>

            <Typography
              component="h2"
              variant="h2"
              sx={{
                fontFamily: serifFont,
                fontSize: { xs: "2.1rem", md: "2.6rem" },
                fontWeight: 600,
                lineHeight: 1.18,
                color: colors.textDark,
                mb: 2.5,
              }}
            >
              Find the Right Program for Your Goals
            </Typography>

            <Typography
              sx={{
                color: colors.textLight,
                fontSize: "0.95rem",
                lineHeight: 1.75,
                mb: 4,
              }}
            >
              Whether you want to lose weight, build energy, or improve your
              relationship with food, I have a program designed for you.
            </Typography>

            <Button
              onClick={handleOpenPlans}
              variant="contained"
              sx={{
                bgcolor: colors.primary,
                color: colors.white,
                py: 1.3,
                px: 3.5,
                borderRadius: 50,
                fontSize: "0.92rem",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: colors.primaryDark,
                },
              }}
            >
              View All Programs
            </Button>
          </Box>

          {/* Right Column: Program Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {programCards.map((program) => (
              <Card
                key={program.id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.white,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 36px rgba(121, 152, 91, 0.12)",
                    borderColor: colors.primary,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="165"
                  image={program.image}
                  alt={program.title}
                  onError={(event) => {
                    if (event.currentTarget.dataset.fallbackApplied) {
                      return;
                    }

                    event.currentTarget.dataset.fallbackApplied = "true";
                    event.currentTarget.src = program.fallbackImage;
                  }}
                  sx={{
                    objectFit: "cover",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                />

                <CardContent
                  sx={{
                    p: 2.75,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    component="h3"
                    variant="h5"
                    sx={{
                      fontFamily: serifFont,
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: colors.textDark,
                      mb: 1.25,
                    }}
                  >
                    {program.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: colors.textLight,
                      fontSize: "0.88rem",
                      lineHeight: 1.65,
                      mb: 2.5,
                      flexGrow: 1,
                    }}
                  >
                    {program.desc}
                  </Typography>

                  <Button
                    onClick={openBooking}
                    variant="text"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: "0.95rem" }} />}
                    sx={{
                      alignSelf: "flex-start",
                      p: 0,
                      color: colors.textDark,
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      "&:hover": {
                        bgcolor: "transparent",
                        color: colors.primary,
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Pricing / All Programs Modal */}
      <Dialog
        open={plansModalOpen}
        onClose={handleClosePlans}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: { xs: 1, sm: 2, md: 3 },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            pb: 1,
          }}
        >
          <Box>
            <Typography
              component="h2"
              variant="h4"
              sx={{
                fontFamily: serifFont,
                fontWeight: 600,
                fontSize: { xs: "1.6rem", sm: "2rem" },
              }}
            >
              Consultation & Nutrition Programs
            </Typography>

            <Typography
              sx={{
                color: colors.textLight,
                fontSize: "0.9rem",
                mt: 0.5,
              }}
            >
              Transparent pricing — choose the support that fits your timeline
            </Typography>
          </Box>

          <IconButton
            onClick={handleClosePlans}
            aria-label="Close programs"
            sx={{ flexShrink: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2.5,
              mt: 1,
            }}
          >
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: `1.5px solid ${
                    plan.featured ? colors.primary : colors.border
                  }`,
                  position: "relative",
                  bgcolor: plan.featured
                    ? "rgba(121, 152, 91, 0.03)"
                    : colors.white,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {plan.badge && (
                  <Chip
                    label={plan.badge}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: colors.primary,
                      color: colors.white,
                      fontWeight: 700,
                    }}
                  />
                )}

                <Typography
                  component="h3"
                  sx={{
                    fontFamily: serifFont,
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    mb: 0.5,
                    pr: plan.badge ? 7 : 0,
                  }}
                >
                  {plan.name}
                </Typography>

                <Typography
                  sx={{
                    color: colors.textLight,
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  {plan.desc}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: colors.textDark,
                  }}
                >
                  {plan.price}
                </Typography>

                <Typography
                  sx={{
                    color: colors.textLight,
                    fontSize: "0.8rem",
                    mb: 2,
                  }}
                >
                  {plan.period}
                </Typography>

                <List
                  dense
                  disablePadding
                  sx={{
                    mb: 2.5,
                    flexGrow: 1,
                  }}
                >
                  {plan.features?.map((feature) => (
                    <ListItem
                      key={feature}
                      disableGutters
                      sx={{
                        py: 0.7,
                        alignItems: "flex-start",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 26,
                          mt: "2px",
                        }}
                      >
                        <CheckCircleIcon
                          sx={{
                            fontSize: "0.95rem",
                            color: colors.primary,
                          }}
                        />
                      </ListItemIcon>

                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          fontSize: "0.85rem",
                          color: colors.textLight,
                          lineHeight: 1.5,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  onClick={handleChoosePlan}
                  fullWidth
                  size="large"
                  variant={plan.featured ? "contained" : "outlined"}
                  sx={{
                    borderRadius: 50,
                    py: 1.2,
                    borderWidth: 2,
                    ...(plan.featured
                      ? {
                          background: gradientBrand,
                          color: colors.white,
                          boxShadow: "0 4px 15px rgba(121, 152, 91, 0.3)",
                          "&:hover": {
                            background: gradientBrand,
                            opacity: 0.95,
                          },
                        }
                      : {
                          color: colors.primary,
                          borderColor: colors.primary,
                          "&:hover": {
                            borderWidth: 2,
                            borderColor: colors.primaryDark,
                            bgcolor: "rgba(121, 152, 91, 0.08)",
                          },
                        }),
                  }}
                >
                  Select Plan
                </Button>
              </Card>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  LinearProgress,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EventIcon from "@mui/icons-material/Event";
import { colors, gradientBrand } from "../theme";
import { useBooking } from "../context/BookingContext";
import { getWhatsAppUrl, trackWhatsAppClick, trackEvent } from "../utils/analytics";
import { useSiteContent } from "../context/SiteContentContext";

const GOALS = [
  { id: "WEIGHT_LOSS", label: "Sustainable Weight Loss", desc: "Lose belly fat, build energy, zero starvation", icon: "🥗" },
  { id: "PCOS_PCOD", label: "PCOS / PCOD Balance", desc: "Regulate cycles, reduce bloating, clear skin", icon: "🌸" },
  { id: "THYROID", label: "Thyroid & Metabolism", desc: "Combat fatigue, sluggish metabolism & weight stalls", icon: "⚡" },
  { id: "GUT_HEALTH", label: "Gut Health & Digestion", desc: "Fix bloating, acidity, constipation & inflammation", icon: "🥑" },
  { id: "LIFESTYLE", label: "Diabetes & Heart Health", desc: "Evidence-based blood sugar & cholesterol reversal", icon: "🩺" },
];

const CHALLENGES = [
  { id: "CRAVINGS", label: "Intense Sugar & Evening Cravings", icon: "🍩" },
  { id: "BUSY_LIFESTYLE", label: "Desk Job / No Time for Complicated Cooking", icon: "⏳" },
  { id: "REBOUND_WEIGHT", label: "Lost Weight Before But Gained It Right Back", icon: "📉" },
  { id: "HORMONES", label: "Hormones / Stubborn Stagnant Weight", icon: "⚖️" },
];

const DIET_TYPES = [
  { id: "VEG", label: "Vegetarian (Dal, Paneer, Roti, Rice)", icon: "🥦" },
  { id: "NON_VEG", label: "Eggetarian / Non-Vegetarian", icon: "🍗" },
  { id: "JAIN", label: "Jain / No Onion Garlic", icon: "🌿" },
];

export default function DietQuiz() {
  const { openBooking } = useBooking();
  const { contact } = useSiteContent();

  const [step, setStep] = useState(0); // 0: Goal, 1: Challenge, 2: Diet Type, 3: Result
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);

  const handleSelectGoal = (goal) => {
    setSelectedGoal(goal);
    trackEvent("Quiz_Step_1", { goal: goal.label });
    setStep(1);
  };

  const handleSelectChallenge = (ch) => {
    setSelectedChallenge(ch);
    trackEvent("Quiz_Step_2", { challenge: ch.label });
    setStep(2);
  };

  const handleSelectDiet = (d) => {
    setSelectedDiet(d);
    trackEvent("Quiz_Completed", {
      goal: selectedGoal?.label,
      challenge: chLabel(chId),
      diet: d.label,
    });
    setStep(3);
  };

  const chId = selectedChallenge?.id;
  const chLabel = (id) => selectedChallenge?.label || "";

  const handleReset = () => {
    setStep(0);
    setSelectedGoal(null);
    setSelectedChallenge(null);
    setSelectedDiet(null);
  };

  const waPrompt = `Hi Dietitian Ruchika! I just took your website assessment: My goal is ${selectedGoal?.label || "Weight Loss"}, my biggest struggle is ${selectedChallenge?.label || "Cravings"}, and I follow a ${selectedDiet?.label || "Vegetarian"} diet. Can you help me with a personalized plan?`;
  const waUrl = getWhatsAppUrl(contact.whatsappNumber, waPrompt);

  return (
    <Box
      component="section"
      id="diet-assessment"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: colors.bgSage,
        width: "100%",
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 2, md: 2.5 } }}>
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.primary,
              mb: 0.5,
            }}
          >
            FREE ASSESSMENT
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.45rem", sm: "1.7rem", md: "1.85rem" },
              fontWeight: 700,
              color: colors.textDark,
              letterSpacing: "-0.01em",
              mb: 0.5,
            }}
          >
            Find Your Nutrition Roadmap
          </Typography>
          <Typography
            sx={{
              fontSize: "0.84rem",
              color: colors.textLight,
              maxWidth: 480,
              mx: "auto",
              lineHeight: 1.5,
            }}
          >
            Answer 3 quick questions to discover your personalized timeline and nutritional focus
          </Typography>
        </Box>

        {/* Quiz Card */}
        <Paper
          elevation={0}
          className="scrollable-content"
          sx={{
            p: { xs: 2.25, sm: 3 },
            borderRadius: "20px",
            bgcolor: colors.white,
            border: "1px solid rgba(0, 0, 0, 0.07)",
            boxShadow: "0 10px 30px -10px rgba(56, 75, 50, 0.1)",
            "@keyframes quizFade": {
              "0%": { opacity: 0, transform: "translateX(16px)" },
              "100%": { opacity: 1, transform: "translateX(0)" },
            },
            "@media (prefers-reduced-motion: reduce)": {
              "& *": {
                animation: "none !important",
                transition: "none !important",
              },
            },
          }}
        >
          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
              <Typography variant="caption" fontWeight={700} color={colors.primary}>
                {step < 3 ? `Step ${step + 1} of 3` : "Your Personalized Result"}
              </Typography>
              <Typography variant="caption" fontWeight={600} color={colors.textLight}>
                {step === 0 && "33%"}
                {step === 1 && "66%"}
                {step === 2 && "90%"}
                {step === 3 && "100% Ready!"}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={step === 0 ? 33 : step === 1 ? 66 : step === 2 ? 90 : 100}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: colors.primarySubtle,
                "& .MuiLinearProgress-bar": {
                  background: gradientBrand,
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* STEP 1: GOAL */}
          {step === 0 && (
            <Box sx={{ animation: "quizFade 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <Typography variant="h6" fontWeight={800} color={colors.textDark} sx={{ mb: 0.25, fontSize: "1.1rem" }}>
                What is your primary health goal?
              </Typography>
              <Typography variant="body2" color={colors.textLight} sx={{ mb: 1.75, fontSize: "0.82rem" }}>
                Select the area that matters most to your body right now.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.25,
                }}
              >
                {GOALS.map((g, idx) => (
                  <Button
                    key={g.id}
                    onClick={() => handleSelectGoal(g)}
                    variant="outlined"
                    sx={{
                      justifyContent: "flex-start",
                      p: { xs: 1.15, sm: 1.35 },
                      borderRadius: "14px",
                      borderColor: "rgba(0, 0, 0, 0.09)",
                      bgcolor: "#ffffff",
                      textAlign: "left",
                      gridColumn: idx === 4 ? { sm: "span 2" } : "span 1",
                      transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        borderColor: colors.primaryDark,
                        bgcolor: colors.primarySubtle,
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(56, 75, 50, 0.08)",
                        "& .quiz-arrow": {
                          transform: "translateX(4px)",
                          color: colors.primaryDark,
                        },
                        "& .quiz-icon": {
                          transform: "scale(1.15) rotate(4deg)",
                        },
                      },
                      "&:active": {
                        transform: "scale(0.98)",
                      },
                    }}
                  >
                    <Box
                      className="quiz-icon"
                      sx={{
                        fontSize: "1.4rem",
                        mr: 1.5,
                        flexShrink: 0,
                        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      {g.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={700} color={colors.textDark} sx={{ fontSize: "0.92rem", lineHeight: 1.25 }}>
                        {g.label}
                      </Typography>
                      <Typography variant="caption" color={colors.textLight} sx={{ fontSize: "0.72rem", display: "block" }}>
                        {g.desc}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon
                      className="quiz-arrow"
                      sx={{ color: colors.textLight, fontSize: "1rem", transition: "all 0.2s ease" }}
                    />
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* STEP 2: CHALLENGE */}
          {step === 1 && (
            <Box sx={{ animation: "quizFade 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <Typography variant="h6" fontWeight={800} color={colors.textDark} sx={{ mb: 0.25, fontSize: "1.1rem" }}>
                What has been your biggest obstacle so far?
              </Typography>
              <Typography variant="body2" color={colors.textLight} sx={{ mb: 1.75, fontSize: "0.82rem" }}>
                Knowing this helps Dietitian Ruchika design a plan you can actually stick to long-term.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.25,
                }}
              >
                {CHALLENGES.map((c) => (
                  <Button
                    key={c.id}
                    onClick={() => handleSelectChallenge(c)}
                    variant="outlined"
                    sx={{
                      justifyContent: "flex-start",
                      p: { xs: 1.2, sm: 1.4 },
                      borderRadius: "14px",
                      borderColor: "rgba(0, 0, 0, 0.09)",
                      bgcolor: "#ffffff",
                      textAlign: "left",
                      transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        borderColor: colors.primaryDark,
                        bgcolor: colors.primarySubtle,
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(56, 75, 50, 0.08)",
                        "& .quiz-arrow": {
                          transform: "translateX(4px)",
                          color: colors.primaryDark,
                        },
                        "& .quiz-icon": {
                          transform: "scale(1.15) rotate(4deg)",
                        },
                      },
                      "&:active": {
                        transform: "scale(0.98)",
                      },
                    }}
                  >
                    <Box
                      className="quiz-icon"
                      sx={{
                        fontSize: "1.4rem",
                        mr: 1.5,
                        flexShrink: 0,
                        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      {c.icon}
                    </Box>
                    <Typography fontWeight={700} color={colors.textDark} sx={{ fontSize: "0.92rem", flexGrow: 1 }}>
                      {c.label}
                    </Typography>
                    <ArrowForwardIcon
                      className="quiz-arrow"
                      sx={{ color: colors.textLight, fontSize: "1rem", transition: "all 0.2s ease" }}
                    />
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* STEP 3: DIET TYPE */}
          {step === 2 && (
            <Box sx={{ animation: "quizFade 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <Typography variant="h6" fontWeight={800} color={colors.textDark} sx={{ mb: 0.25, fontSize: "1.1rem" }}>
                What type of meals do you prefer at home?
              </Typography>
              <Typography variant="body2" color={colors.textLight} sx={{ mb: 1.75, fontSize: "0.82rem" }}>
                We design plans around your existing kitchen habits—no fancy, expensive ingredients.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                  gap: 1.25,
                }}
              >
                {DIET_TYPES.map((d) => (
                  <Button
                    key={d.id}
                    onClick={() => handleSelectDiet(d)}
                    variant="outlined"
                    sx={{
                      justifyContent: "flex-start",
                      p: { xs: 1.2, sm: 1.4 },
                      borderRadius: "14px",
                      borderColor: "rgba(0, 0, 0, 0.09)",
                      bgcolor: "#ffffff",
                      textAlign: "left",
                      transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        borderColor: colors.primaryDark,
                        bgcolor: colors.primarySubtle,
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(56, 75, 50, 0.08)",
                        "& .quiz-arrow": {
                          transform: "translateX(4px)",
                          color: colors.primaryDark,
                        },
                        "& .quiz-icon": {
                          transform: "scale(1.15) rotate(4deg)",
                        },
                      },
                      "&:active": {
                        transform: "scale(0.98)",
                      },
                    }}
                  >
                    <Box
                      className="quiz-icon"
                      sx={{
                        fontSize: "1.4rem",
                        mr: 1.25,
                        flexShrink: 0,
                        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      {d.icon}
                    </Box>
                    <Typography fontWeight={700} color={colors.textDark} sx={{ fontSize: "0.88rem", flexGrow: 1 }}>
                      {d.label}
                    </Typography>
                    <ArrowForwardIcon
                      className="quiz-arrow"
                      sx={{ color: colors.textLight, fontSize: "1rem", transition: "all 0.2s ease" }}
                    />
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* STEP 4: PERSONALIZED RESULT */}
          {step === 3 && (
            <Box sx={{ animation: "quizFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <Box
                sx={{
                  bgcolor: colors.primarySubtle,
                  p: { xs: 2, sm: 2.75 },
                  borderRadius: "18px",
                  border: "1px solid rgba(56, 75, 50, 0.2)",
                  mb: 2.5,
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.25 }}>
                  <CheckCircleIcon sx={{ color: colors.primaryDark, fontSize: "1.5rem" }} />
                  <Typography variant="h6" fontWeight={800} color={colors.primaryDark} sx={{ fontSize: "1.05rem" }}>
                    Your Recommended Strategy
                  </Typography>
                </Stack>

                <Typography sx={{ fontSize: "0.98rem", fontWeight: 700, color: colors.textDark, mb: 1 }}>
                  Target Protocol: Sustainable {selectedGoal?.label || "Metabolic"} Plan
                </Typography>

                <Typography variant="body2" color={colors.textMuted} sx={{ lineHeight: 1.6, mb: 2, fontSize: "0.84rem" }}>
                  Because your main challenge is <strong>{selectedChallenge?.label || "lifestyle fatigue"}</strong>, standard restrictive dieting will backfire. Dietitian Ruchika’s approach will balance your hormones and blood sugar using <strong>100% {selectedDiet?.label?.split(" ")[0] || "Home"} Meals</strong>—so you burn fat naturally without feeling starved.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Box sx={{ bgcolor: colors.white, p: 1.5, borderRadius: "12px", flex: 1, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <Typography variant="caption" color={colors.textLight} fontWeight={700} textTransform="uppercase">
                      Realistic Timeline
                    </Typography>
                    <Typography variant="body1" fontWeight={800} color={colors.primaryDark}>
                      8 – 12 Weeks
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: colors.white, p: 1.5, borderRadius: "12px", flex: 1, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <Typography variant="caption" color={colors.textLight} fontWeight={700} textTransform="uppercase">
                      Diet Philosophy
                    </Typography>
                    <Typography variant="body1" fontWeight={800} color={colors.primaryDark}>
                      Real Ghar Ka Khana
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 1.5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="medium"
                  onClick={openBooking}
                  startIcon={<EventIcon />}
                  sx={{
                    background: gradientBrand,
                    py: 1.2,
                    borderRadius: "24px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    boxShadow: "0 6px 18px -4px rgba(5, 150, 105, 0.35)",
                  }}
                >
                  Book 1-on-1 Consultation
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="medium"
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsAppClick("Quiz Result")}
                  startIcon={<WhatsAppIcon sx={{ fontSize: "1.1rem" }} />}
                  sx={{
                    color: "#166534",
                    borderColor: "rgba(34, 197, 94, 0.4)",
                    bgcolor: "rgba(34, 197, 94, 0.08)",
                    borderRadius: "24px",
                    fontWeight: 700,
                    py: 1.2,
                    fontSize: "0.9rem",
                    "&:hover": {
                      borderColor: "#22c55e",
                      bgcolor: "rgba(34, 197, 94, 0.16)",
                    },
                  }}
                >
                  Discuss on WhatsApp
                </Button>
              </Stack>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  size="small"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                  sx={{ color: colors.textLight, fontWeight: 600, textTransform: "none" }}
                >
                  Retake Assessment
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

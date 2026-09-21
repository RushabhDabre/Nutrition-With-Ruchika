import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { colors, serifFont } from "../theme";
import SectionTitle from "./SectionTitle";

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

function ResultCard({ children }) {
  if (!children) return null;
  return (
    <Box
      sx={{
        mt: 3,
        p: 2.5,
        borderRadius: "14px",
        bgcolor: colors.bgLight,
        border: `1.5px solid ${colors.primary}`,
      }}
    >
      {children}
    </Box>
  );
}

function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return;
    const bmi = w / (h * h);
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else if (bmi >= 30) category = "Obese";
    setResult({ bmi: bmi.toFixed(1), category });
  };

  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
        />
        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          fullWidth
        />
      </Box>
      <Button
        fullWidth
        variant="contained"
        onClick={calculate}
        sx={{
          mt: 2.5,
          bgcolor: colors.primary,
          py: 1.3,
          borderRadius: 50,
          "&:hover": { bgcolor: colors.primaryDark },
        }}
        startIcon={<CalculateIcon />}
      >
        Calculate BMI
      </Button>
      <ResultCard>
        {result && (
          <>
            <Typography
              sx={{
                fontSize: "2.2rem",
                fontWeight: 700,
                fontFamily: serifFont,
                color: colors.primary,
              }}
            >
              {result.bmi}
            </Typography>
            <Typography sx={{ fontWeight: 600, color: colors.textDark }}>
              Category: {result.category}
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: colors.textLight, mt: 1 }}>
              BMI is a general screening indicator. Book a consultation for a personalized body composition assessment.
            </Typography>
          </>
        )}
      </ResultCard>
    </Box>
  );
}

const ACTIVITY_LEVELS = [
  { label: "Sedentary (little/no exercise)", value: 1.2 },
  { label: "Light (exercise 1-3 days/week)", value: 1.375 },
  { label: "Moderate (exercise 3-5 days/week)", value: 1.55 },
  { label: "Active (exercise 6-7 days/week)", value: 1.725 },
  { label: "Very Active (hard exercise + physical job)", value: 1.9 },
];

function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Female");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState(1.55);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w) return;
    const bmr =
      gender === "Male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * activity;
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
  };

  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          fullWidth
        >
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
        </TextField>
        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
        />
        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          fullWidth
        />
      </Box>
      <TextField
        select
        label="Activity Level"
        value={activity}
        onChange={(e) => setActivity(Number(e.target.value))}
        fullWidth
      >
        {ACTIVITY_LEVELS.map((a) => (
          <MenuItem key={a.value} value={a.value}>
            {a.label}
          </MenuItem>
        ))}
      </TextField>
      <Button
        fullWidth
        variant="contained"
        onClick={calculate}
        sx={{
          mt: 2.5,
          bgcolor: colors.primary,
          py: 1.3,
          borderRadius: 50,
          "&:hover": { bgcolor: colors.primaryDark },
        }}
        startIcon={<CalculateIcon />}
      >
        Calculate Calories
      </Button>
      <ResultCard>
        {result && (
          <>
            <Typography
              sx={{
                fontSize: "2.2rem",
                fontWeight: 700,
                fontFamily: serifFont,
                color: colors.primary,
              }}
            >
              {result.tdee} kcal/day
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: colors.textDark }}>
              Estimated daily calories to maintain current weight
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography sx={{ fontSize: "0.85rem", color: colors.textLight }}>
              Basal Metabolic Rate (BMR): {result.bmr} kcal/day
            </Typography>
          </>
        )}
      </ResultCard>
    </Box>
  );
}

function IdealWeightCalculator() {
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("Female");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const h = parseFloat(height);
    if (!h) return;
    const totalInches = h / 2.54;
    const inchesOver5Feet = Math.max(totalInches - 60, 0);
    const idealKg =
      gender === "Male"
        ? 50 + 2.3 * inchesOver5Feet
        : 45.5 + 2.3 * inchesOver5Feet;
    setResult({ idealKg: idealKg.toFixed(1) });
  };

  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          fullWidth
        >
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
        </TextField>
      </Box>
      <Button
        fullWidth
        variant="contained"
        onClick={calculate}
        sx={{
          mt: 2.5,
          bgcolor: colors.primary,
          py: 1.3,
          borderRadius: 50,
          "&:hover": { bgcolor: colors.primaryDark },
        }}
        startIcon={<CalculateIcon />}
      >
        Calculate Ideal Weight
      </Button>
      <ResultCard>
        {result && (
          <>
            <Typography
              sx={{
                fontSize: "2.2rem",
                fontWeight: 700,
                fontFamily: serifFont,
                color: colors.primary,
              }}
            >
              {result.idealKg} kg
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: colors.textLight, mt: 1 }}>
              General reference range (Devine formula). Ideal weight also depends on muscle mass, bone density, and metabolic goals.
            </Typography>
          </>
        )}
      </ResultCard>
    </Box>
  );
}

function WaterCalculator() {
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    if (!w) return;
    const liters = w * 0.033;
    setResult({
      liters: liters.toFixed(1),
      glasses: Math.round((liters * 1000) / 250),
    });
  };

  return (
    <Box>
      <TextField
        label="Weight (kg)"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        fullWidth
      />
      <Button
        fullWidth
        variant="contained"
        onClick={calculate}
        sx={{
          mt: 2.5,
          bgcolor: colors.primary,
          py: 1.3,
          borderRadius: 50,
          "&:hover": { bgcolor: colors.primaryDark },
        }}
        startIcon={<CalculateIcon />}
      >
        Calculate Water Intake
      </Button>
      <ResultCard>
        {result && (
          <>
            <Typography
              sx={{
                fontSize: "2.2rem",
                fontWeight: 700,
                fontFamily: serifFont,
                color: colors.primary,
              }}
            >
              {result.liters} L/day
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: colors.textDark }}>
              ≈ {result.glasses} standard glasses (250ml each)
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: colors.textLight, mt: 1 }}>
              Baseline daily requirement. Increase intake during high heat, heavy workouts, or athletic activity.
            </Typography>
          </>
        )}
      </ResultCard>
    </Box>
  );
}

export default function HealthTools() {
  const [tab, setTab] = useState(0);

  return (
    <Box
      component="section"
      id="health-tools"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: colors.bgLight,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="sm">
        <SectionTitle
          eyebrow="Interactive Tools"
          title="Quick Health Calculators"
          subtitle="Estimate your numbers instantly — schedule a consultation for a clinically personalized diet plan."
        />
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            border: `1px solid ${colors.border}`,
            borderRadius: 4,
            bgcolor: colors.white,
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { background: colors.primary, height: 3, borderRadius: 2 } }}
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                fontSize: "0.9rem",
                textTransform: "none",
                "&.Mui-selected": {
                  color: colors.primary,
                },
              },
            }}
          >
            <Tab label="BMI" />
            <Tab label="Calories" />
            <Tab label="Ideal Weight" />
            <Tab label="Water Intake" />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <BMICalculator />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <CalorieCalculator />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <IdealWeightCalculator />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <WaterCalculator />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}

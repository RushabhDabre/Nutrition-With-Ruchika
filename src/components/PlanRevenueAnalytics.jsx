import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Tooltip,
  Divider,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { colors } from "../theme";
import { exportRevenueReportToExcel } from "../utils/exportToExcel";
import { useFeedback } from "../context/FeedbackContext";

const PALETTE = [
  "#2D6A4F", // Dark green
  "#40916C", // Medium green
  "#52B788", // Light green
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
];

export default function PlanRevenueAnalytics({
  planPayments = [],
  bookings = [],
  onExportClients,
}) {
  const [period, setPeriod] = useState("ALL"); // "ALL", "MONTH", "30DAYS"
  const { showSnackbar } = useFeedback();

  // Filter payments by selected time period
  const filteredPayments = useMemo(() => {
    if (!Array.isArray(planPayments)) return [];
    if (period === "ALL") return planPayments;

    const now = new Date();
    const cutoff = new Date();

    if (period === "30DAYS") {
      cutoff.setDate(now.getDate() - 30);
    } else if (period === "MONTH") {
      cutoff.setDate(1);
      cutoff.setHours(0, 0, 0, 0);
    }

    return planPayments.filter((p) => {
      const dateToCheck = p.paidAt || p.createdAt;
      if (!dateToCheck) return false;
      const d = new Date(dateToCheck);
      return d >= cutoff;
    });
  }, [planPayments, period]);

  // Filter bookings discovery fee by period
  const filteredDiscoveryRevenue = useMemo(() => {
    if (!Array.isArray(bookings)) return 0;
    const now = new Date();
    const cutoff = new Date();

    if (period === "30DAYS") {
      cutoff.setDate(now.getDate() - 30);
    } else if (period === "MONTH") {
      cutoff.setDate(1);
      cutoff.setHours(0, 0, 0, 0);
    }

    return bookings.reduce((sum, b) => {
      if (!b?.amountPaidInr) return sum;
      if (period === "ALL") return sum + Number(b.amountPaidInr);
      const d = new Date(b.createdAt || b.bookingDate);
      if (d >= cutoff) return sum + Number(b.amountPaidInr);
      return sum;
    }, 0);
  }, [bookings, period]);

  // Aggregate stats per plan
  const {
    breakdown,
    totalPlanRevenue,
    totalPaidCount,
    totalPendingRevenue,
    avgPlanValue,
  } = useMemo(() => {
    const map = new Map();
    let totalRev = 0;
    let paidCount = 0;
    let pendingRev = 0;

    filteredPayments.forEach((p) => {
      const rawName = p.planNameSnapshot || "Custom Plan";
      const name = rawName.trim();
      const amount = Number(p.amountInr || 0);

      if (!map.has(name)) {
        map.set(name, {
          name,
          paidRevenue: 0,
          paidCount: 0,
          pendingRevenue: 0,
          pendingCount: 0,
        });
      }

      const item = map.get(name);
      if (p.status === "PAID") {
        item.paidRevenue += amount;
        item.paidCount += 1;
        totalRev += amount;
        paidCount += 1;
      } else if (p.status === "CREATED") {
        item.pendingRevenue += amount;
        item.pendingCount += 1;
        pendingRev += amount;
      }
    });

    const list = Array.from(map.values())
      .map((item, index) => {
        const percentage = totalRev > 0 ? Math.round((item.paidRevenue / totalRev) * 100) : 0;
        return {
          ...item,
          percentage,
          color: PALETTE[index % PALETTE.length],
        };
      })
      .sort((a, b) => b.paidRevenue - a.paidRevenue);

    const avg = paidCount > 0 ? Math.round(totalRev / paidCount) : 0;

    return {
      breakdown: list,
      totalPlanRevenue: totalRev,
      totalPaidCount: paidCount,
      totalPendingRevenue: pendingRev,
      avgPlanValue: avg,
    };
  }, [filteredPayments]);

  const grandTotal = totalPlanRevenue + filteredDiscoveryRevenue;

  const handleExportRevenue = () => {
    try {
      exportRevenueReportToExcel(breakdown, totalPlanRevenue, filteredDiscoveryRevenue);
      showSnackbar("Plan revenue report downloaded!", "success");
    } catch (err) {
      showSnackbar(err.message || "Failed to export report.", "error");
    }
  };

  // Helper for SVG Donut chart calculation
  const donutSlices = useMemo(() => {
    if (totalPlanRevenue === 0 || breakdown.length === 0) return [];
    let cumulative = 0;
    return breakdown.map((item) => {
      const fraction = item.paidRevenue / totalPlanRevenue;
      const startAngle = cumulative * 360;
      cumulative += fraction;
      const endAngle = cumulative * 360;
      return {
        ...item,
        startAngle,
        endAngle,
      };
    });
  }, [breakdown, totalPlanRevenue]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        {/* Top Header & Period Controls */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <DonutSmallIcon sx={{ color: colors.primary, fontSize: 28 }} />
              <Typography variant="h6" fontWeight={800}>
                Plan Revenue & Performance
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Visual analytics of enrolled consultation plans, cash flow, and client conversions.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {/* Period Filters */}
            <Stack direction="row" spacing={0.5} sx={{ bgcolor: "#f1f5f9", p: 0.5, borderRadius: 2 }}>
              <Button
                size="small"
                variant={period === "ALL" ? "contained" : "text"}
                onClick={() => setPeriod("ALL")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  px: 1.5,
                  borderRadius: 1.5,
                  ...(period === "ALL"
                    ? { bgcolor: colors.primary, color: colors.white, "&:hover": { bgcolor: colors.primaryDark } }
                    : { color: colors.textLight }),
                }}
              >
                All Time
              </Button>
              <Button
                size="small"
                variant={period === "MONTH" ? "contained" : "text"}
                onClick={() => setPeriod("MONTH")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  px: 1.5,
                  borderRadius: 1.5,
                  ...(period === "MONTH"
                    ? { bgcolor: colors.primary, color: colors.white, "&:hover": { bgcolor: colors.primaryDark } }
                    : { color: colors.textLight }),
                }}
              >
                This Month
              </Button>
              <Button
                size="small"
                variant={period === "30DAYS" ? "contained" : "text"}
                onClick={() => setPeriod("30DAYS")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  px: 1.5,
                  borderRadius: 1.5,
                  ...(period === "30DAYS"
                    ? { bgcolor: colors.primary, color: colors.white, "&:hover": { bgcolor: colors.primaryDark } }
                    : { color: colors.textLight }),
                }}
              >
                Last 30 Days
              </Button>
            </Stack>

            {/* Export Revenue Report */}
            <Tooltip title="Download plan revenue breakdown as CSV/Excel">
              <Button
                size="small"
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportRevenue}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: colors.border,
                  color: colors.primary,
                  "&:hover": { borderColor: colors.primary, bgcolor: "rgba(45, 106, 79, 0.04)" },
                }}
              >
                Export Report
              </Button>
            </Tooltip>
          </Stack>
        </Stack>

        {/* 4 Summary Metric Cards */}
        <Grid container spacing={2} sx={{ mb: 3.5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" fontWeight={600} color="#166534">
                  TOTAL REVENUE
                </Typography>
                <MonetizationOnIcon sx={{ color: "#16a34a", fontSize: 20 }} />
              </Stack>
              <Typography variant="h5" fontWeight={800} color="#14532d">
                ₹{grandTotal.toLocaleString("en-IN")}
              </Typography>
              <Typography variant="caption" color="#15803d">
                Plans: ₹{totalPlanRevenue.toLocaleString("en-IN")} • Calls: ₹{filteredDiscoveryRevenue.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  PLAN ENROLLMENTS
                </Typography>
                <PeopleAltIcon sx={{ color: "#64748b", fontSize: 20 }} />
              </Stack>
              <Typography variant="h5" fontWeight={800}>
                {totalPaidCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Clients enrolled in paid plans
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  AVG. PLAN VALUE
                </Typography>
                <TrendingUpIcon sx={{ color: "#64748b", fontSize: 20 }} />
              </Stack>
              <Typography variant="h5" fontWeight={800}>
                ₹{avgPlanValue.toLocaleString("en-IN")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Average revenue per client
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: totalPendingRevenue > 0 ? "#fffbeb" : "#f8fafc",
                border: `1px solid ${totalPendingRevenue > 0 ? "#fef3c7" : "#e2e8f0"}`,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" fontWeight={600} color={totalPendingRevenue > 0 ? "#92400e" : "text.secondary"}>
                  PENDING LINKS
                </Typography>
                <Typography variant="caption" fontWeight={700} color={totalPendingRevenue > 0 ? "#b45309" : "text.secondary"}>
                  Awaiting Payment
                </Typography>
              </Stack>
              <Typography variant="h5" fontWeight={800} color={totalPendingRevenue > 0 ? "#78350f" : "inherit"}>
                ₹{totalPendingRevenue.toLocaleString("en-IN")}
              </Typography>
              <Typography variant="caption" color={totalPendingRevenue > 0 ? "#b45309" : "text.secondary"}>
                Active links dispatched to clients
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Breakdown & Visualization Body */}
        {breakdown.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign: "center",
              bgcolor: "#f8fafc",
              borderRadius: 3,
              border: "1px dashed #cbd5e1",
            }}
          >
            <DonutSmallIcon sx={{ fontSize: 44, color: "#94a3b8", mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              No Plan Payments in Selected Period
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: "auto", mt: 0.5 }}>
              When clients pay for consultation plans online or when you record offline payments, the revenue distribution chart and plan metrics will appear here.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} alignItems="center">
            {/* Visual SVG Donut Distribution Chart */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                  bgcolor: "#f8fafc",
                  borderRadius: 3,
                  border: "1px solid #f1f5f9",
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                  Revenue Share by Plan
                </Typography>

                {/* SVG Donut */}
                <Box sx={{ position: "relative", width: 190, height: 190 }}>
                  <svg width="190" height="190" viewBox="0 0 100 100">
                    {/* Background ring */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="16" />

                    {/* Slices using SVG stroke-dasharray */}
                    {donutSlices.map((slice, i) => {
                      const circumference = 2 * Math.PI * 38; // approx 238.76
                      const fraction = slice.paidRevenue / totalPlanRevenue;
                      const strokeDash = fraction * circumference;
                      const strokeGap = circumference - strokeDash;
                      // Offset calculation
                      const prevFractions = donutSlices.slice(0, i).reduce((sum, s) => sum + s.paidRevenue / totalPlanRevenue, 0);
                      const dashOffset = -prevFractions * circumference;

                      return (
                        <circle
                          key={slice.name}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke={slice.color}
                          strokeWidth="16"
                          strokeDasharray={`${strokeDash} ${strokeGap}`}
                          strokeDashoffset={dashOffset}
                          transform="rotate(-90 50 50)"
                          style={{ transition: "all 0.5s ease" }}
                        />
                      );
                    })}
                  </svg>

                  {/* Center Text */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.68rem" }}>
                      PLANS TOTAL
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={800} color={colors.primary}>
                      ₹{totalPlanRevenue.toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Box>

                {/* Legend Pills below donut */}
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 2, gap: 1 }}>
                  {breakdown.map((item) => (
                    <Chip
                      key={item.name}
                      size="small"
                      avatar={
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: item.color,
                            ml: 0.5,
                          }}
                        />
                      }
                      label={`${item.name}: ${item.percentage}%`}
                      variant="outlined"
                      sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* Ranked Plan Progress Bars */}
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                Plan Performance Breakdown
              </Typography>

              <Stack spacing={2}>
                {breakdown.map((item, index) => (
                  <Box
                    key={item.name}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: "1px solid #f1f5f9",
                      bgcolor: colors.white,
                      "&:hover": { bgcolor: "#f8fafc", borderColor: "#e2e8f0" },
                      transition: "all 0.2s",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {index === 0 ? (
                          <Chip
                            icon={<EmojiEventsIcon sx={{ fontSize: "14px !important", color: "#f59e0b" }} />}
                            label="#1 Top"
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              bgcolor: "#fef3c7",
                              color: "#b45309",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" fontWeight={700} color="text.secondary">
                            #{index + 1}
                          </Typography>
                        )}
                        <Typography variant="subtitle2" fontWeight={700}>
                          {item.name}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight={800} color={colors.primary}>
                          ₹{item.paidRevenue.toLocaleString("en-IN")}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${item.percentage}%`}
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor: "rgba(45, 106, 79, 0.08)",
                            color: colors.primary,
                          }}
                        />
                      </Stack>
                    </Stack>

                    {/* Progress Bar */}
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: item.color,
                          borderRadius: 4,
                        },
                        mb: 1.25,
                      }}
                    />

                    {/* Sub-metrics */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        <b>{item.paidCount}</b> client{item.paidCount === 1 ? "" : "s"} enrolled
                      </Typography>
                      <Divider orientation="vertical" flexItem sx={{ height: 12, my: "auto" }} />
                      <Typography variant="caption" color="text.secondary">
                        Avg: <b>₹{item.paidCount > 0 ? Math.round(item.paidRevenue / item.paidCount).toLocaleString("en-IN") : 0}</b>
                      </Typography>
                      {item.pendingCount > 0 && (
                        <>
                          <Divider orientation="vertical" flexItem sx={{ height: 12, my: "auto" }} />
                          <Typography variant="caption" color="#d97706" fontWeight={600}>
                            {item.pendingCount} link{item.pendingCount === 1 ? "" : "s"} pending (₹{item.pendingRevenue.toLocaleString("en-IN")})
                          </Typography>
                        </>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}

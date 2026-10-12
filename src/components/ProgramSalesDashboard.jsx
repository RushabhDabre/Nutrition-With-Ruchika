import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import RefreshIcon from "@mui/icons-material/Refresh";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { colors, gradientBrand } from "../theme";
import { adminFetch } from "../utils/adminAuth";

export default function ProgramSalesDashboard() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPurchases = () => {
    setLoading(true);
    setError("");
    adminFetch("/api/admin/programs/purchases")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load program enrollments");
        return res.json();
      })
      .then((data) => {
        setPurchases(data || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load program sales.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const totalRevenue = purchases
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + (p.amountPaidInr || 0), 0);

  const totalPaidEnrollments = purchases.filter((p) => p.status === "PAID").length;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="800">
            Program Sales & Enrollments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View clients who enrolled in special plans (e.g. Navratri Plan, Starter, Transformation)
          </Typography>
        </Box>
        <Button
          onClick={fetchPurchases}
          startIcon={<RefreshIcon />}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, mb: 4 }}>
        <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border}`, bgcolor: colors.white }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: gradientBrand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.white,
              }}
            >
              <MonetizationOnIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                TOTAL PROGRAM REVENUE
              </Typography>
              <Typography variant="h4" fontWeight="800" sx={{ color: colors.primary }}>
                ₹{totalRevenue.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border}`, bgcolor: colors.white }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.success,
              }}
            >
              <PeopleAltIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                ACTIVE PAID ENROLLMENTS
              </Typography>
              <Typography variant="h4" fontWeight="800" sx={{ color: colors.textDark }}>
                {totalPaidEnrollments}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <Paper sx={{ borderRadius: 3, border: `1px solid ${colors.border}`, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress sx={{ color: colors.primary }} />
          </Box>
        ) : purchases.length === 0 ? (
          <Box sx={{ textAlign: "center", p: 6 }}>
            <Typography variant="h6" color="text.secondary" fontWeight="600">
              No program enrollments yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              When clients buy your special plan on the website, they will appear here with their contact details.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Plan</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Enrolled Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Contact Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((p) => {
                  const cleanPhone = p.clientPhone ? p.clientPhone.replace(/\D/g, "") : "";
                  const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                  const waMsg = encodeURIComponent(
                    `Hi ${p.clientName}, thank you for enrolling in the ${p.planName}! I am excited to guide you on your journey. Let's begin by discussing your routine and meal preferences.`
                  );
                  const waLink = `https://wa.me/${waNumber}?text=${waMsg}`;

                  return (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="700">
                          {p.clientName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {p.clientEmail}
                        </Typography>
                        {p.clientCity && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            📍 {p.clientCity}
                          </Typography>
                        )}
                        {p.notes && (
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{
                              mt: 0.5,
                              p: 0.75,
                              bgcolor: "#f1f5f9",
                              borderRadius: 1,
                              maxWidth: 220,
                              whiteSpace: "normal",
                            }}
                          >
                            📝 {p.notes}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={p.planName}
                          size="small"
                          sx={{ fontWeight: 600, bgcolor: "#e0e7ff", color: colors.primary }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight="700">
                          ₹{p.amountPaidInr?.toLocaleString("en-IN")}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={p.status}
                          size="small"
                          color={p.status === "PAID" ? "success" : "default"}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(p.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            component="a"
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            startIcon={<WhatsAppIcon />}
                            sx={{
                              bgcolor: "#25D366",
                              "&:hover": { bgcolor: "#1ebd5a" },
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                            }}
                          >
                            WhatsApp
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            component="a"
                            href={`mailto:${p.clientEmail}`}
                            startIcon={<EmailIcon />}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontSize: "0.8rem",
                            }}
                          >
                            Email
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

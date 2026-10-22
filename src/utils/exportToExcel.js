import * as XLSX from "xlsx";

/**
 * Format date as DD/MM/YYYY
 */
function formatDate(dateValue) {
  if (!dateValue) return "";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(dateValue);
  }
}

/**
 * Calculate column widths dynamically based on cell content length
 */
function calculateColWidths(dataMatrix) {
  const colWidths = [];
  dataMatrix.forEach((row) => {
    row.forEach((cell, colIndex) => {
      const len = cell !== null && cell !== undefined ? String(cell).length : 0;
      colWidths[colIndex] = Math.max(colWidths[colIndex] || 12, len + 3);
    });
  });
  return colWidths.map((w) => ({ wch: Math.min(w, 50) })); // Cap max width at 50 for readability
}

/**
 * Exports all client bookings and their enrolled consultation plans into a genuine Excel (.xlsx) workbook.
 */
export function exportClientsToExcel(bookings = [], planPayments = []) {
  if (!Array.isArray(bookings) || bookings.length === 0) {
    throw new Error("No client data available to export.");
  }

  // Pre-index payments by bookingId
  const paymentsByBooking = new Map();
  (planPayments || []).forEach((p) => {
    if (!p.bookingId) return;
    if (!paymentsByBooking.has(p.bookingId)) {
      paymentsByBooking.set(p.bookingId, []);
    }
    paymentsByBooking.get(p.bookingId).push(p);
  });

  const headers = [
    "Client Name",
    "Phone / WhatsApp",
    "Email",
    "Age",
    "Gender",
    "City / Location",
    "Primary Health Goal",
    "Diet Preference",
    "Medical History / Medication",
    "Appointment Date",
    "Slot Time",
    "Booking Status",
    "Consultation Status",
    "Consultation Fee Paid (INR)",
    "Enrolled Plan Name",
    "Plan Price (INR)",
    "Plan Payment Status",
    "Plan Paid Date",
    "Plan Payment ID / Mode",
    "Total Paid (INR)",
    "Clinical Notes",
    "Google Drive Folder URL",
    "Registered Date"
  ];

  const rows = bookings.map((b) => {
    const payments = paymentsByBooking.get(b.id) || [];
    const paidPayment = payments.find((p) => p.status === "PAID") || payments[0];

    const planName = paidPayment ? paidPayment.planNameSnapshot || "Custom Plan" : "None";
    const planPrice = paidPayment ? Number(paidPayment.amountInr || 0) : 0;
    const planStatus = paidPayment ? paidPayment.status : "NOT_ENROLLED";
    const planPaidDate = paidPayment?.paidAt ? formatDate(paidPayment.paidAt) : (paidPayment?.status === "PAID" ? formatDate(paidPayment.createdAt) : "");
    const planPaymentId = paidPayment?.razorpayPaymentId || (paidPayment?.status === "PAID" ? "OFFLINE / DIRECT" : "");

    const consultFee = Number(b.amountPaidInr || 0);
    const totalPaid = consultFee + (paidPayment?.status === "PAID" ? planPrice : 0);

    const cleanPhone = String(b.phone || "").replace(/\D/g, "");

    return [
      b.name || "",
      cleanPhone || "",
      b.email || "",
      b.age ? Number(b.age) : "",
      b.gender || "",
      b.city || "",
      b.goal || "",
      b.dietType || "",
      b.medication || "",
      formatDate(b.bookingDate),
      b.slotStartTime ? String(b.slotStartTime).substring(0, 5) : "",
      b.status || "",
      b.meetingStatus === "MEETING_COMPLETED" ? "Completed" : "Scheduled",
      consultFee,
      planName,
      planPrice,
      planStatus,
      planPaidDate,
      planPaymentId,
      totalPaid,
      b.clinicalNotes || "",
      b.driveFolderUrl || "",
      formatDate(b.createdAt)
    ];
  });

  const matrix = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(matrix);

  // Set explicit string type ('s') on Phone column so leading zeros and long numbers display properly
  for (let r = 1; r <= rows.length; r++) {
    const phoneCellRef = XLSX.utils.encode_cell({ r, c: 1 });
    if (worksheet[phoneCellRef]) {
      worksheet[phoneCellRef].t = "s";
    }
  }

  // Set auto-calculated column widths
  worksheet["!cols"] = calculateColWidths(matrix);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clients & Consultations");

  const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  XLSX.writeFile(workbook, `Nutrition_Clients_Report_${todayStr}.xlsx`);
}

/**
 * Exports Plan Revenue Breakdown into a genuine Excel (.xlsx) workbook.
 */
export function exportRevenueReportToExcel(planBreakdown = [], totalPlanRevenue = 0, totalConsultationRevenue = 0) {
  const headers = [
    "Plan Name",
    "Enrolled Clients (Paid)",
    "Total Plan Revenue (INR)",
    "Share of Plan Revenue (%)",
    "Pending Payment Links"
  ];

  const rows = planBreakdown.map((item) => [
    item.name,
    Number(item.paidCount || 0),
    Number(item.paidRevenue || 0),
    `${item.percentage}%`,
    Number(item.pendingCount || 0)
  ]);

  const grandTotal = totalPlanRevenue + totalConsultationRevenue;
  const summaryRows = [
    ["", "", "", "", ""],
    ["Total Consultation Plan Revenue", "", Number(totalPlanRevenue || 0), "100%", ""],
    ["Discovery Calls Revenue", "", Number(totalConsultationRevenue || 0), "", ""],
    ["GRAND TOTAL REVENUE", "", Number(grandTotal || 0), "", ""]
  ];

  const matrix = [headers, ...rows, ...summaryRows];
  const worksheet = XLSX.utils.aoa_to_sheet(matrix);

  worksheet["!cols"] = calculateColWidths(matrix);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Plan Revenue Performance");

  const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  XLSX.writeFile(workbook, `Nutrition_Plan_Revenue_Report_${todayStr}.xlsx`);
}

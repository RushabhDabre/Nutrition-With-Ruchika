import { adminFetch } from "./adminAuth";

export async function getAdminBookings() {
  const res = await adminFetch("/api/admin/bookings");

  if (!res.ok) {
    throw new Error("Failed to load bookings");
  }

  return res.json();
}

export const getBookings = getAdminBookings;

export async function getUnviewedBookingCount() {
  const res = await adminFetch("/api/admin/bookings/unviewed-count");

  if (!res.ok) {
    throw new Error("Failed to load booking count");
  }

  return res.json();
}

export async function markBookingAsViewed(id) {
  const res = await adminFetch(`/api/admin/bookings/${id}/viewed`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed to mark booking as viewed");
  }

  return res.status === 204 ? null : res.json();
}

export async function updateMeetingStatus(id, status) {
  const res = await adminFetch(`/api/admin/bookings/${id}/meeting-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update meeting status");
  }

  return res.json();
}

export async function getConsultationPlans() {
  const res = await adminFetch("/api/admin/consultation-plans");

  if (!res.ok) {
    throw new Error("Failed to load consultation plans");
  }

  return res.json();
}

export async function createConsultationPlan(payload) {
  const res = await adminFetch("/api/admin/consultation-plans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to create consultation plan");
  }

  return data;
}

export async function createPlanPaymentLink(bookingId, planId) {
  const res = await adminFetch(
    `/api/admin/consultation-plans/bookings/${bookingId}/payment-link?planId=${encodeURIComponent(planId)}`,
    { method: "POST" },
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to create payment link");
  }

  return data;
}

export async function getBookingPaymentLinks(bookingId) {
  const res = await adminFetch(
    `/api/admin/consultation-plans/bookings/${bookingId}/payment-links`,
  );

  if (!res.ok) {
    throw new Error("Failed to load payment links");
  }

  return res.json();
}

export async function markPaymentLinkPaid(paymentId) {
  const res = await adminFetch(`/api/admin/consultation-plans/payment-links/${paymentId}/mark-paid`, {
    method: "POST"
  });

  if (!res.ok) {
    throw new Error("Failed to mark as paid");
  }
}

export async function updateClientWorkspace(bookingId, { driveFolderUrl, clinicalNotes }) {
  const res = await adminFetch(`/api/admin/bookings/${bookingId}/client-workspace`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ driveFolderUrl, clinicalNotes }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update client workspace");
  }

  return res.json();
}

export async function recordOfflinePayment(bookingId, planId, paymentNotes = "") {
  const params = new URLSearchParams({ planId });
  if (paymentNotes) params.append("paymentNotes", paymentNotes);
  const res = await adminFetch(
    `/api/admin/consultation-plans/bookings/${bookingId}/record-offline-payment?${params.toString()}`,
    { method: "POST" }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to record payment");
  }

  return data;
}

export async function createManualClient(payload) {
  const res = await adminFetch("/api/admin/bookings/manual-client", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to add client");
  }

  return data;
}

export async function getAllPlanPayments() {
  const res = await adminFetch("/api/admin/consultation-plans/payments");

  if (!res.ok) {
    throw new Error("Failed to load plan payments");
  }

  return res.json();
}

export async function toggleBookingDisabled(bookingId) {
  const res = await adminFetch(`/api/admin/bookings/${bookingId}/toggle-disabled`, {
    method: "PATCH",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || "Failed to update booking status");
  }

  return res.json();
}

export async function deleteBooking(bookingId) {
  const res = await adminFetch(`/api/admin/bookings/${bookingId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || "Failed to delete booking");
  }

  return true;
}



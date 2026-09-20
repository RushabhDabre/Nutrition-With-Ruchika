import { adminFetch } from "./adminAuth";

export async function getAdminBookings() {
  const res = await adminFetch("/api/admin/bookings");

  if (!res.ok) {
    throw new Error("Failed to load bookings");
  }

  return res.json();
}

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

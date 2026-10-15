import { adminFetch } from "./adminAuth";

export async function getEmployees() {
  const res = await adminFetch("/api/admin/employees");
  if (!res.ok) throw new Error("Failed to load employees");
  return res.json();
}

export async function createEmployee(data) {
  const res = await adminFetch("/api/admin/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create employee");
  }
  return res.json();
}

export async function updateEmployee(id, data) {
  const res = await adminFetch(`/api/admin/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update employee");
  }
  return res.json();
}

export async function resetEmployeePassword(id, newPassword) {
  const res = await adminFetch(`/api/admin/employees/${id}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to reset password");
  }
  return res.json();
}

export async function deleteEmployee(id) {
  const res = await adminFetch(`/api/admin/employees/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete employee");
  }
}

export async function getEmployeeAssignedClients(id) {
  const res = await adminFetch(`/api/admin/employees/${id}/clients`);
  if (!res.ok) throw new Error("Failed to load assigned clients");
  return res.json();
}

export async function assignClientsToEmployee(id, bookingIds) {
  const res = await adminFetch(`/api/admin/employees/${id}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingIds }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to assign clients");
  }
  return res.json();
}

export async function unassignClientFromEmployee(id, bookingId) {
  const res = await adminFetch(`/api/admin/employees/${id}/clients/${bookingId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to unassign client");
}

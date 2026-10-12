import { adminFetch } from './adminAuth';

export async function getWeeklySchedule() {
  const res = await adminFetch('/api/admin/availability/weekly-schedule');
  if (!res.ok) throw new Error('Failed to load weekly schedule');
  return res.json();
}

export async function updateWeeklySchedule(schedule) {
  const res = await adminFetch('/api/admin/availability/weekly-schedule', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedule),
  });
  if (!res.ok) throw new Error('Failed to update weekly schedule');
  return res.json();
}

export async function getDateOverrides(from, to) {
  const res = await adminFetch(
    `/api/admin/availability/date-overrides?from=${from}&to=${to}`
  );
  if (!res.ok) throw new Error('Failed to load date overrides');
  return res.json();
}

export async function upsertDateOverride(override) {
  const res = await adminFetch('/api/admin/availability/date-overrides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(override),
  });
  if (!res.ok) throw new Error('Failed to save date override');
  return res.json();
}

export async function deleteDateOverride(date) {
  const res = await adminFetch(
    `/api/admin/availability/date-overrides/${date}`,
    { method: 'DELETE' }
  );
  if (!res.ok) throw new Error('Failed to delete date override');
}

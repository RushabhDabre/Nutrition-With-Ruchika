import { apiBaseUrl } from '../data/siteData';

const STORAGE_KEY = 'nutrition_ruchika_pending_payment';

export function savePendingPayment(data) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency,
      keyId: data.keyId,
      bookingDate: data.bookingDate,
      slotStartTime: data.slotStartTime,
      createdAt: Date.now(),
    })
  );
}

export function getPendingPayment() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearPendingPayment() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function getPaymentRecoveryStatus(orderId) {
  const response = await fetch(
    `${apiBaseUrl}/api/bookings/payment-status?orderId=${encodeURIComponent(orderId)}`
  );

  if (!response.ok) {
    throw new Error('Unable to check payment status');
  }

  return response.json();
}
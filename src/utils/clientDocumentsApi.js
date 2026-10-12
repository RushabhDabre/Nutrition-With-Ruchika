import { adminFetch } from './adminAuth';

export async function getBookingDocuments(bookingId) {
  const res = await adminFetch(`/api/admin/documents/booking/${bookingId}`);
  if (!res.ok) {
    throw new Error('Failed to load documents');
  }
  return res.json();
}

export async function uploadBookingDocument(bookingId, file, documentType, notes) {
  const formData = new FormData();
  formData.append('file', file);
  if (documentType) {
    formData.append('documentType', documentType);
  }
  if (notes) {
    formData.append('notes', notes);
  }

  const res = await adminFetch(`/api/admin/documents/booking/${bookingId}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload document');
  }

  return res.json();
}

export async function deleteBookingDocument(documentId) {
  const res = await adminFetch(`/api/admin/documents/${documentId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete document');
  }

  return true;
}

export function getDocumentViewUrl(doc) {
  if (!doc) return '#';
  if (doc.fileUrl && (doc.fileUrl.startsWith('http://') || doc.fileUrl.startsWith('https://'))) {
    return doc.fileUrl;
  }
  const apiBase = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
  return `${apiBase}/api/admin/documents/${doc.id}/view`;
}

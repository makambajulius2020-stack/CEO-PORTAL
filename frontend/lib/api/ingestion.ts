export type Branch = 'patiobella' | 'eateroo';
export type FileType = 'procurement' | 'inventory' | 'sales' | 'finance' | 'petty_cash';

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}


function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || '';
}

function api(path: string) {
  const base = getApiUrl();
  if (!base) return path;
  return `${base}${path}`;
}

export async function uploadExcelFile(file: File, branch: Branch, fileType: FileType) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('branch', branch);
  formData.append('file_type', fileType);

  const res = await fetch(api('/api/ingestion/upload'), {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Upload failed');
  }

  return res.json();
}

export async function importFromLink(url: string, branch: Branch, fileType: FileType) {
  const res = await fetch(api('/api/ingestion/import-link'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ url, branch, file_type: fileType }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Import failed');
  }
  return res.json();
}

export async function getFilePreview(fileId: string, rows: number = 10) {
  const res = await fetch(api(`/api/ingestion/file/${fileId}/preview?rows=${rows}`), {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Preview failed');
  }

  return res.json();
}

export function downloadFileUrl(fileId: string) {
  return api(`/api/ingestion/file/${fileId}`);
}

export async function listUploads(params?: { limit?: number; branch?: Branch; fileType?: FileType }) {
  const q = new URLSearchParams();
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.branch) q.set('branch', params.branch);
  if (params?.fileType) q.set('file_type', params.fileType);

  const res = await fetch(api(`/api/ingestion/uploads?${q.toString()}`), {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to load uploads');
  }
  return res.json();
}

export async function getExtractionAudit(excelUploadId: number) {
  const res = await fetch(api(`/api/ingestion/audit/${excelUploadId}`), {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to load audit');
  }
  return res.json();
}

export type Branch = 'patiobella' | 'eateroo';
export type FileType = 'procurement' | 'inventory' | 'sales' | 'finance' | 'petty_cash';

export type UploadStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'review_needed';

export interface MockUploadRow {
  id: number;
  original_filename: string;
  branch: Branch;
  file_type: FileType;
  upload_date: string;
  file_size: number;
  mongo_gridfs_id: string;
  processing_status: UploadStatus;
  ai_audit_score?: number;
  ai_audit_id?: string;
}

interface Store {
  nextId: number;
  uploads: MockUploadRow[];
  files: Record<string, { name: string; bytesBase64: string }>;
  audits: Record<string, any>;
}

function getStore(): Store {
  const g = globalThis as any;
  if (!g.__HUGAMARA_MOCK_STORE__) {
    g.__HUGAMARA_MOCK_STORE__ = {
      nextId: 1,
      uploads: [],
      files: {},
      audits: {},
    } satisfies Store;
  }
  return g.__HUGAMARA_MOCK_STORE__ as Store;
}

export function base64FromArrayBuffer(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function arrayBufferFromBase64(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function createUpload(params: { filename: string; branch: Branch; file_type: FileType; size: number; bytesBase64: string }) {
  const store = getStore();
  const fileId = `mock_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  store.files[fileId] = { name: params.filename, bytesBase64: params.bytesBase64 };

  const id = store.nextId++;
  const upload: MockUploadRow = {
    id,
    original_filename: params.filename,
    branch: params.branch,
    file_type: params.file_type,
    upload_date: new Date().toISOString(),
    file_size: params.size,
    mongo_gridfs_id: fileId,
    processing_status: 'processing',
  };
  store.uploads.unshift(upload);

  // Simulate background processing completing shortly
  setTimeout(() => {
    const s = getStore();
    const u = s.uploads.find((x) => x.id === id);
    if (!u) return;
    const score = Math.round((7.5 + Math.random() * 2.0) * 10) / 10;
    const auditId = `audit_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    u.processing_status = score >= 6.5 ? 'completed' : 'review_needed';
    u.ai_audit_score = score;
    u.ai_audit_id = auditId;
    s.audits[auditId] = {
      _id: auditId,
      excel_upload_id: id,
      gridfs_file_id: fileId,
      extracted_data: { records: [], file_type: params.file_type },
      column_mappings: [],
      field_confidence: {},
      anomalies: [],
      warnings: [],
      overall_confidence: score,
    };
  }, 2500);

  return { upload, fileId };
}

export function listUploads(limit: number = 50, branch?: Branch, file_type?: FileType) {
  const store = getStore();
  let rows = store.uploads;
  if (branch) rows = rows.filter((r) => r.branch === branch);
  if (file_type) rows = rows.filter((r) => r.file_type === file_type);
  return rows.slice(0, limit);
}

export function getUploadById(id: number) {
  const store = getStore();
  return store.uploads.find((u) => u.id === id) || null;
}

export function getAuditById(auditId: string) {
  const store = getStore();
  return store.audits[auditId] || null;
}

export function getFile(fileId: string) {
  const store = getStore();
  return store.files[fileId] || null;
}

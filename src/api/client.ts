import { API_BASE } from '@/lib/config';

export interface ApiErrorPayload {
  code: string;
  message: string;
  suggestion?: string;
}

export class ApiError extends Error {
  code: string;
  suggestion?: string;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.code = payload.code;
    this.suggestion = payload.suggestion;
  }
}

async function parseErrorResponse(res: Response): Promise<ApiError> {
  try {
    const data = (await res.json()) as ApiErrorPayload;
    return new ApiError(data);
  } catch {
    return new ApiError({ code: 'UNKNOWN_ERROR', message: `Request failed with status ${res.status}.` });
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`);
  if (!res.ok) throw await parseErrorResponse(res);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseErrorResponse(res);
  return res.json() as Promise<T>;
}

export async function apiPostBlob(path: string, body: unknown): Promise<{ blob: Blob; fileName: string }> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseErrorResponse(res);

  const disposition = res.headers.get('Content-Disposition') ?? '';
  const match = /filename="?([^"]+)"?/.exec(disposition);
  const fileName = match?.[1] ?? 'export.xlsx';

  return { blob: await res.blob(), fileName };
}

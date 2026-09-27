const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function checkApiHealth() {
  return apiFetch<{ status: string; database: string; sample_rows: number }>('/api/health');
}

export interface AiReportResponse {
  success: boolean;
  type: string;
  title: string;
  content: string;
  engine: string;
}

export function generateRemoteAiReport(payload: {
  type: string;
  session_id?: string;
  data: Record<string, unknown>;
}): Promise<AiReportResponse> {
  return apiFetch<AiReportResponse>('/api/ai/report', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function askRemoteAiAgent(message: string, data?: string) {
  return apiFetch<{ success: boolean; skill?: string; response: string }>('/api/ai/ask', {
    method: 'POST',
    body: JSON.stringify({ message, data }),
  });
}


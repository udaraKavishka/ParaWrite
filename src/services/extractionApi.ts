import type {
  ExtractionErrorPayload,
  ExtractionHealth,
  ExtractionRequest,
  ExtractionResponse,
} from '@/types/extraction';

const API_BASE_URL = import.meta.env.VITE_EXTRACTION_API_URL || 'http://localhost:8000';
const HEALTH_URL = `${API_BASE_URL}/api/health`;

export async function extractDocument(request: ExtractionRequest): Promise<ExtractionResponse> {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('retry_mode', request.retryMode || 'balanced');
  formData.append('error_reason', request.errorReason || '');
  formData.append('previous_method', request.previousMethod || '');

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/extract`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (/cors|cross-origin|same origin|networkerror/i.test(message)) {
      throw new Error(
        'Cannot reach extraction service due to CORS/network policy. Ensure backend ALLOWED_ORIGINS includes this frontend origin and restart backend.',
      );
    }
    throw new Error(`Cannot connect to extraction service at ${API_BASE_URL}. Is backend running?`);
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ExtractionErrorPayload | null;
    if (payload?.message) {
      const details = payload.details ? ` Details: ${payload.details}` : '';
      const action = payload.suggested_action ? ` Suggested action: ${payload.suggested_action}` : '';
      const attempts = payload.attempts?.length
        ? ` Attempts: ${payload.attempts.map((a) => `${a.method}(${a.code || 'ERR'})`).join(', ')}`
        : '';
      throw new Error(`${payload.message}${action}${details}${attempts}`);
    }
    throw new Error('Extraction failed');
  }

  return response.json();
}

export async function checkExtractionHealth(): Promise<{ ok: boolean; message: string; status: string }> {
  try {
    const response = await fetch(HEALTH_URL, { method: 'GET' });
    if (!response.ok) {
      return { ok: false, message: `Extraction backend unhealthy (${response.status})`, status: 'inactive' };
    }

    const payload = (await response.json()) as ExtractionHealth;
    const status = payload.status || 'inactive';
    const ok = status === 'active';

    const suffix = payload.checks?.ocr_ready === false ? ` (${payload.checks.ocr_message || 'OCR unavailable'})` : '';

    return { ok, status, message: `${payload.message}${suffix}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (/cors|cross-origin|same origin|networkerror/i.test(message)) {
      return {
        ok: false,
        status: 'inactive',
        message:
          'Extraction backend blocked by CORS. Add frontend origin to ALLOWED_ORIGINS and restart backend.',
      };
    }
    return {
      ok: false,
      status: 'inactive',
      message: `Extraction backend unreachable at ${API_BASE_URL}`,
    };
  }
}

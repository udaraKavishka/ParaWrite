export type RetryMode = 'balanced' | 'fast' | 'deep' | 'ocr' | 'auto';

export interface ExtractionResponse {
  text: string;
  file_name: string;
  file_type: string;
  method: string;
  retry_mode: RetryMode;
  error_reason: string;
  warnings: string[];
}

export interface ExtractionRequest {
  file: File;
  retryMode?: RetryMode;
  errorReason?: string;
  previousMethod?: string;
}

export interface ExtractionErrorPayload {
  error_code: string;
  message: string;
  details?: string;
  retryable?: boolean;
  suggested_action?: string;
  attempts?: Array<{ method: string; error: string; code?: string }>;
}

export interface ExtractionHealth {
  status: 'active' | 'inactive' | 'construction' | 'degraded';
  message: string;
  version?: string;
  checks?: {
    parser_ready?: boolean;
    ocr_ready?: boolean;
    ocr_message?: string;
  };
}

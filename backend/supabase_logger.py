from __future__ import annotations

import os
import requests


def log_extraction_event(
    user_id: str | None,
    file_name: str,
    file_type: str,
    method: str,
    retry_mode: str,
    error_reason: str,
    text_length: int,
) -> None:
    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not service_role_key:
        return

    payload = {
        "user_id": user_id,
        "file_name": file_name,
        "file_type": file_type,
        "method": method,
        "retry_mode": retry_mode,
        "error_reason": error_reason,
        "text_length": text_length,
    }

    try:
        requests.post(
            f"{supabase_url.rstrip('/')}/rest/v1/extraction_jobs",
            headers={
                "apikey": service_role_key,
                "Authorization": f"Bearer {service_role_key}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            },
            json=payload,
            timeout=6,
        )
    except Exception:
        # Logging failures should never break extraction flow.
        return

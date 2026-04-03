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
) -> tuple[bool, str]:
    supabase_url = os.getenv("SUPABASE_URL")
    anon_or_publishable_key = os.getenv("SUPABASE_ANON_KEY") or os.getenv(
        "SUPABASE_PUBLISHABLE_KEY"
    )

    if not supabase_url:
        return False, "Supabase URL is not configured"

    if not anon_or_publishable_key:
        return False, "Supabase publishable/anon key is not configured"

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
        response = requests.post(
            f"{supabase_url.rstrip('/')}/rest/v1/extraction_jobs",
            headers={
                "apikey": anon_or_publishable_key,
                "Authorization": f"Bearer {anon_or_publishable_key}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            },
            json=payload,
            timeout=6,
        )
        if response.status_code >= 400:
            return (
                False,
                f"Supabase insert failed ({response.status_code}): {response.text[:200]}",
            )
        return True, "Stored in Supabase"
    except Exception:
        # Logging failures should never break extraction flow.
        return False, "Failed to connect to Supabase logging endpoint"

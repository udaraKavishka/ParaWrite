from __future__ import annotations

import os
from typing import Any

import requests


class AuthError(Exception):
    pass


def _required() -> bool:
    return os.getenv("REQUIRE_SUPABASE_AUTH", "false").lower() == "true"


def verify_supabase_token(authorization_header: str | None) -> dict[str, Any] | None:
    if not authorization_header:
        if _required():
            raise AuthError("Missing Authorization header")
        return None

    if not authorization_header.lower().startswith("bearer "):
        raise AuthError("Invalid Authorization header format")

    token = authorization_header.split(" ", 1)[1].strip()
    if not token:
        raise AuthError("Missing bearer token")

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
    if not supabase_url or not supabase_anon_key:
        if _required():
            raise AuthError("Supabase auth verification is not configured")
        return None

    response = requests.get(
        f"{supabase_url.rstrip('/')}/auth/v1/user",
        headers={
            "Authorization": f"Bearer {token}",
            "apikey": supabase_anon_key,
        },
        timeout=12,
    )

    if response.status_code != 200:
        if _required():
            raise AuthError("Invalid or expired access token")
        return None

    payload = response.json()
    if not isinstance(payload, dict):
        raise AuthError("Invalid user response")

    return payload

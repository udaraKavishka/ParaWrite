import io
import os

from app import create_app


def test_health_endpoint() -> None:
    os.environ["REQUIRE_SUPABASE_AUTH"] = "false"
    os.environ["BACKEND_MODE"] = "active"
    app = create_app()
    client = app.test_client()
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.get_json()
    assert body["status"] in ["active", "degraded", "construction"]
    assert "checks" in body


def test_extract_txt() -> None:
    os.environ["REQUIRE_SUPABASE_AUTH"] = "false"
    app = create_app()
    client = app.test_client()
    data = {
        "file": (io.BytesIO(b"Hello ParaWrite backend"), "sample.txt"),
        "retry_mode": "balanced",
    }
    response = client.post(
        "/api/extract", data=data, content_type="multipart/form-data"
    )
    assert response.status_code == 200
    payload = response.get_json()
    assert "Hello ParaWrite backend" in payload["text"]


def test_extract_no_file_returns_structured_error() -> None:
    os.environ["REQUIRE_SUPABASE_AUTH"] = "false"
    app = create_app()
    client = app.test_client()
    response = client.post("/api/extract", data={}, content_type="multipart/form-data")
    assert response.status_code == 400
    body = response.get_json()
    assert body["error_code"] == "NO_FILE"
    assert "message" in body

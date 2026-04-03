import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from extractors import extract_document_text, ExtractionError
from auth import verify_supabase_token, AuthError
from supabase_logger import log_extraction_event

BACKEND_DIR = os.path.dirname(__file__)
load_dotenv(dotenv_path=os.path.join(BACKEND_DIR, ".env"))


def create_app() -> Flask:
    app = Flask(__name__)

    allowed_origins = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:8080,http://localhost:5173,http://127.0.0.1:8080,http://127.0.0.1:5173",
    )
    origins = [
        origin.strip() for origin in allowed_origins.split(",") if origin.strip()
    ]

    CORS(
        app,
        resources={r"/api/*": {"origins": origins or "*"}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "OPTIONS"],
    )

    @app.get("/api/health")
    def health() -> tuple:
        mode = (os.getenv("BACKEND_MODE") or "active").strip().lower()
        if mode == "construction":
            status = "construction"
        elif mode == "inactive":
            status = "inactive"
        elif mode == "degraded":
            status = "degraded"
        else:
            status = "active"

        ocr_ready = True
        ocr_message = "OCR available"
        try:
            import pytesseract  # type: ignore

            _ = pytesseract.get_tesseract_version()
        except Exception as exc:
            ocr_ready = False
            ocr_message = f"OCR unavailable: {exc}"

        payload = {
            "status": status,
            "message": "Backend active"
            if status == "active"
            else "Backend status override enabled",
            "version": "1.0.0",
            "checks": {
                "parser_ready": True,
                "ocr_ready": ocr_ready,
                "ocr_message": ocr_message,
            },
        }
        return jsonify(payload), 200

    @app.post("/api/extract")
    def extract() -> tuple:
        uploaded = request.files.get("file")
        if not uploaded:
            return (
                jsonify(
                    {
                        "error_code": "NO_FILE",
                        "message": "No file provided",
                        "details": "Attach a file using multipart form field named 'file'.",
                        "retryable": False,
                        "suggested_action": "Upload a supported document and retry.",
                        "attempts": [],
                    }
                ),
                400,
            )

        try:
            user_payload = verify_supabase_token(request.headers.get("Authorization"))
        except AuthError as exc:
            return (
                jsonify(
                    {
                        "error_code": "AUTH_FAILED",
                        "message": str(exc),
                        "details": "Supabase token validation failed.",
                        "retryable": False,
                        "suggested_action": "Sign in again and retry.",
                        "attempts": [],
                    }
                ),
                401,
            )

        retry_mode = (request.form.get("retry_mode") or "auto").strip().lower()
        error_reason = (request.form.get("error_reason") or "").strip()
        previous_method = (request.form.get("previous_method") or "").strip()

        try:
            result = extract_document_text(
                file_storage=uploaded,
                retry_mode=retry_mode,
                error_reason=error_reason,
                previous_method=previous_method,
            )

            log_extraction_event(
                user_id=(user_payload or {}).get("id"),
                file_name=result.get("file_name", ""),
                file_type=result.get("file_type", ""),
                method=result.get("method", ""),
                retry_mode=retry_mode,
                error_reason=error_reason,
                text_length=len(result.get("text", "")),
            )
            return jsonify(result), 200
        except ExtractionError as exc:
            return (
                jsonify(
                    {
                        "error_code": exc.code,
                        "message": exc.message,
                        "details": exc.details,
                        "retryable": exc.retryable,
                        "suggested_action": exc.suggested_action,
                        "attempts": exc.attempts,
                    }
                ),
                exc.status_code,
            )
        except Exception as exc:
            return (
                jsonify(
                    {
                        "error_code": "INTERNAL_SERVER_ERROR",
                        "message": "Extraction failed due to an internal server error.",
                        "details": str(exc),
                        "retryable": True,
                        "suggested_action": "Retry extraction. If this persists, contact support.",
                        "attempts": [],
                    }
                ),
                500,
            )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=False)

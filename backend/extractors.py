from __future__ import annotations

import io
import os
import re
import tempfile
from dataclasses import dataclass
from typing import Callable

import chardet
import docx2txt
import markdown
import pypdf
import pymupdf
import pdfplumber
from bs4 import BeautifulSoup
from docx import Document
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename


class ExtractionError(Exception):
    def __init__(
        self,
        message: str,
        *,
        code: str = "EXTRACTION_ERROR",
        details: str = "",
        retryable: bool = True,
        suggested_action: str = "",
        attempts: list[dict] | None = None,
        status_code: int = 400,
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details
        self.retryable = retryable
        self.suggested_action = suggested_action
        self.attempts = attempts or []
        self.status_code = status_code


MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024


@dataclass
class Strategy:
    name: str
    fn: Callable[[bytes, str], str]


def _read_stream(file_storage: FileStorage) -> tuple[bytes, str]:
    filename = secure_filename(file_storage.filename or "upload")
    payload = file_storage.read()

    if len(payload) == 0:
        raise ExtractionError(
            "Uploaded file is empty",
            code="EMPTY_FILE",
            retryable=False,
            suggested_action="Upload a non-empty file.",
        )

    if len(payload) > MAX_FILE_SIZE_BYTES:
        raise ExtractionError(
            "File too large. Max supported size is 20MB.",
            code="FILE_TOO_LARGE",
            retryable=False,
            suggested_action="Upload a smaller file.",
        )

    return payload, filename


def _detect_type(filename: str) -> str:
    ext = os.path.splitext(filename.lower())[1].strip(".")
    if not ext:
        raise ExtractionError(
            "Unsupported file type",
            code="UNSUPPORTED_FILE_TYPE",
            retryable=False,
            suggested_action="Upload PDF, DOCX, DOC, MD, MDX, or TXT.",
        )
    return ext


def _clean_text(text: str) -> str:
    text = text.replace("\x00", "")
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _extract_txt(payload: bytes, _ext: str) -> str:
    detected = chardet.detect(payload)
    enc = detected.get("encoding") or "utf-8"
    try:
        return payload.decode(enc)
    except Exception:
        return payload.decode("utf-8", errors="replace")


def _extract_pdf_pymupdf(payload: bytes, _ext: str) -> str:
    with pymupdf.open(stream=payload, filetype="pdf") as doc:
        text = "\n".join(page.get_text("text") for page in doc)
    return text


def _extract_pdf_pypdf(payload: bytes, _ext: str) -> str:
    reader = pypdf.PdfReader(io.BytesIO(payload))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def _extract_pdf_pdfplumber(payload: bytes, _ext: str) -> str:
    with pdfplumber.open(io.BytesIO(payload)) as pdf:
        return "\n".join((page.extract_text() or "") for page in pdf.pages)


def _extract_docx_docx2txt(payload: bytes, _ext: str) -> str:
    temp_name = f"/tmp/parawrite_{os.getpid()}.docx"
    with open(temp_name, "wb") as fh:
        fh.write(payload)
    try:
        return docx2txt.process(temp_name) or ""
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)


def _extract_docx_python_docx(payload: bytes, _ext: str) -> str:
    doc = Document(io.BytesIO(payload))
    return "\n".join(p.text for p in doc.paragraphs)


def _strip_mdx_noise(text: str) -> str:
    text = re.sub(r"^---[\s\S]*?---", "", text, count=1)
    text = re.sub(r"import\s+.*?;", "", text)
    text = re.sub(r"export\s+.*?;", "", text)
    text = re.sub(r"<[^>]+>", " ", text)
    return text


def _extract_markdown(payload: bytes, ext: str) -> str:
    source = _extract_txt(payload, ext)
    if ext == "mdx":
        source = _strip_mdx_noise(source)
    html = markdown.markdown(source)
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text("\n")


def _extract_doc_textract(payload: bytes, _ext: str) -> str:
    try:
        import textract  # type: ignore
    except Exception as exc:
        raise ExtractionError(
            "DOC support is not enabled on this server.",
            code="DOC_TEXTRACT_MISSING",
            details=str(exc),
            retryable=False,
            suggested_action="Convert DOC to DOCX and retry.",
        )

    temp_name = f"/tmp/parawrite_{os.getpid()}.doc"
    with open(temp_name, "wb") as fh:
        fh.write(payload)
    try:
        output = textract.process(temp_name)
        return output.decode("utf-8", errors="replace")
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)


def _next_retry_mode(previous_method: str, error_reason: str) -> str:
    reason = (error_reason or "").lower()
    if "scan" in reason or "image" in reason or "ocr" in reason:
        return "ocr"
    if not previous_method:
        return "balanced"
    if "pypdf" in previous_method:
        return "deep"
    if "pdfplumber" in previous_method:
        return "ocr"
    if "pymupdf" in previous_method:
        return "fast"
    return "deep"


def _strategy_chain(
    ext: str, retry_mode: str, previous_method: str, error_reason: str
) -> list[Strategy]:
    mode = retry_mode
    if retry_mode == "auto":
        mode = _next_retry_mode(previous_method, error_reason)

    if ext == "pdf":
        if mode == "fast":
            candidates = [
                Strategy("pypdf-fast", _extract_pdf_pypdf),
                Strategy("pymupdf", _extract_pdf_pymupdf),
                Strategy("pdfplumber", _extract_pdf_pdfplumber),
            ]
        elif mode == "ocr":
            candidates = [
                Strategy("ocr-pdf", _extract_pdf_ocr),
                Strategy("pymupdf", _extract_pdf_pymupdf),
                Strategy("pypdf-fast", _extract_pdf_pypdf),
            ]
        elif mode == "deep":
            candidates = [
                Strategy("pdfplumber", _extract_pdf_pdfplumber),
                Strategy("pymupdf", _extract_pdf_pymupdf),
                Strategy("pypdf-fast", _extract_pdf_pypdf),
            ]
        else:
            candidates = [
                Strategy("pymupdf", _extract_pdf_pymupdf),
                Strategy("pypdf-fast", _extract_pdf_pypdf),
                Strategy("pdfplumber", _extract_pdf_pdfplumber),
            ]
    elif ext == "docx":
        candidates = [
            Strategy("docx2txt", _extract_docx_docx2txt),
            Strategy("python-docx", _extract_docx_python_docx),
        ]
    elif ext == "doc":
        candidates = [Strategy("textract-doc", _extract_doc_textract)]
    elif ext in {"md", "markdown", "mdx"}:
        candidates = [Strategy("markdown-parser", _extract_markdown)]
    elif ext == "txt":
        candidates = [Strategy("plain-text", _extract_txt)]
    else:
        raise ExtractionError(
            f"Unsupported file type: .{ext}",
            code="UNSUPPORTED_FILE_TYPE",
            retryable=False,
            suggested_action="Upload PDF, DOCX, DOC, MD, MDX, or TXT.",
        )

    if previous_method:
        candidates = [s for s in candidates if s.name != previous_method] + [
            s for s in candidates if s.name == previous_method
        ]

    return candidates


def _extract_pdf_ocr(payload: bytes, _ext: str) -> str:
    try:
        import pytesseract  # type: ignore
    except Exception as exc:
        raise ExtractionError(
            "OCR requires pytesseract and the tesseract binary.",
            code="OCR_LIBRARY_MISSING",
            details=str(exc),
            suggested_action="Install pytesseract in Python and tesseract-ocr on the server.",
        )

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(payload)
        tmp_path = tmp.name

    text_chunks: list[str] = []
    try:
        with pymupdf.open(tmp_path) as doc:
            for page_index in range(len(doc)):
                page = doc.load_page(page_index)
                pix = page.get_pixmap(dpi=220)
                image_bytes = pix.tobytes("png")
                try:
                    from PIL import Image
                except Exception as exc:
                    raise ExtractionError(
                        "OCR image support requires Pillow.",
                        code="OCR_IMAGE_LIBRARY_MISSING",
                        details=str(exc),
                        suggested_action="Install Pillow and retry OCR.",
                    )
                image = Image.open(io.BytesIO(image_bytes))
                try:
                    page_text = pytesseract.image_to_string(image)
                except Exception as exc:
                    raise ExtractionError(
                        "OCR failed while processing page images.",
                        code="OCR_MISSING_BINARY",
                        details=str(exc),
                        suggested_action="Install tesseract-ocr binary and ensure it is in PATH.",
                    )
                if page_text:
                    text_chunks.append(page_text)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    return "\n".join(text_chunks)


def extract_document_text(
    file_storage: FileStorage,
    retry_mode: str = "balanced",
    error_reason: str = "",
    previous_method: str = "",
) -> dict:
    payload, filename = _read_stream(file_storage)
    ext = _detect_type(filename)
    strategies = _strategy_chain(ext, retry_mode, previous_method, error_reason)

    last_error = None
    attempts: list[dict] = []
    for strategy in strategies:
        try:
            raw = strategy.fn(payload, ext)
            text = _clean_text(raw)
            if not text:
                raise ExtractionError(
                    "Extractor returned empty text",
                    code="EMPTY_EXTRACTION",
                    suggested_action="Retry extraction with another method.",
                )

            return {
                "text": text,
                "file_name": filename,
                "file_type": ext,
                "method": strategy.name,
                "retry_mode": retry_mode,
                "error_reason": error_reason,
                "warnings": [],
            }
        except ExtractionError as exc:
            attempts.append(
                {"method": strategy.name, "error": exc.message, "code": exc.code}
            )
            last_error = f"{strategy.name}: {exc.message}"
        except Exception as exc:
            attempts.append(
                {"method": strategy.name, "error": str(exc), "code": "METHOD_FAILURE"}
            )
            last_error = f"{strategy.name}: {exc}"

    raise ExtractionError(
        "All extraction methods failed",
        code="ALL_METHODS_FAILED",
        details=last_error or "Unknown extraction failure",
        attempts=attempts,
        suggested_action="Click retry and describe what is wrong with extraction.",
    )

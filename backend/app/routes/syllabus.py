from fastapi import APIRouter
# kept for compatibility - actual /api/syllabus lives in progress.py to avoid double prefix
router = APIRouter(prefix="/api", tags=["syllabus"])

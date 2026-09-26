from fastapi import APIRouter
router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])
# actual leaderboard lives in progress.py at /api/leaderboard

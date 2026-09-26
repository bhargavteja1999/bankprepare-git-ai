from fastapi import APIRouter
router = APIRouter(prefix="/api/games", tags=["games"])
@router.get("")
def list_games(): return [{"id":1,"name":"Speed Math","xp":10},{"id":2,"name":"Memory Game"},{"id":3,"name":"Vocabulary Battle"}]

from fastapi import APIRouter, Depends
from ..utils.security import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me")
def me(current: User = Depends(get_current_user)):
    return {"id": current.id, "email": current.email, "name": current.name, "role": current.role, "is_active": current.is_active}

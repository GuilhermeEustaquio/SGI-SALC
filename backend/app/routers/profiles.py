from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_super_admin
from app.models.profile import Profile
from app.schemas.profile import ProfileOut

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("", response_model=list[ProfileOut], dependencies=[Depends(require_super_admin)])
def list_profiles(db: Session = Depends(get_db)):
    return db.query(Profile).all()

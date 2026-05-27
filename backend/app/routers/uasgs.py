from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_super_admin
from app.models.uasg import Uasg
from app.schemas.uasg import UasgCreate, UasgOut

router = APIRouter(prefix="/uasgs", tags=["uasgs"])

@router.get("", response_model=list[UasgOut], dependencies=[Depends(require_super_admin)])
def list_uasgs(db: Session = Depends(get_db)):
    return db.query(Uasg).all()

@router.post("", response_model=UasgOut, dependencies=[Depends(require_super_admin)])
def create_uasg(data: UasgCreate, db: Session = Depends(get_db)):
    if db.query(Uasg).filter_by(codigo=data.codigo).first():
        raise HTTPException(400, "UASG já cadastrada")
    obj = Uasg(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

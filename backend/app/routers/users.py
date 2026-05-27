from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_super_admin
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserOut

router = APIRouter(prefix="/users", tags=["users"])

@router.get("", response_model=list[UserOut], dependencies=[Depends(require_super_admin)])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.post("", response_model=UserOut, dependencies=[Depends(require_super_admin)])
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter((User.login == data.login) | (User.email == data.email)).first():
        raise HTTPException(400, "Login/email já existe")
    user = User(nome=data.nome, login=data.login, email=data.email, cpf=data.cpf, senha_hash=get_password_hash(data.senha), ativo=True, deve_trocar_senha=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

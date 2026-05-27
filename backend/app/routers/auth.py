from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_session, get_user_profiles
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.profile import Profile, UserUasgProfile
from app.models.uasg import Uasg
from app.models.user import User
from app.schemas.auth import ChangePasswordRequest, LoginRequest, TokenResponse
from app.services.audit_log_service import log_action

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.login == data.login).first()
    if not user or not verify_password(data.senha, user.senha_hash):
        raise HTTPException(status_code=401, detail="Login ou senha inválidos")
    if not user.ativo:
        raise HTTPException(status_code=403, detail="Usuário bloqueado")

    super_admin = db.query(Profile).filter_by(nome="SUPER_ADMIN").first()
    is_super_admin = bool(
        super_admin and db.query(UserUasgProfile).filter_by(user_id=user.id, profile_id=super_admin.id, ativo=True).first()
    )

    uasg_atual = None
    if not is_super_admin:
        if not data.uasg:
            raise HTTPException(status_code=400, detail="UASG obrigatória")
        uasg = db.query(Uasg).filter(Uasg.codigo == data.uasg, Uasg.ativa.is_(True)).first()
        if not uasg:
            raise HTTPException(status_code=404, detail="UASG inválida")
        profiles = get_user_profiles(db, user.id, uasg.id)
        if not profiles:
            raise HTTPException(status_code=403, detail="Usuário sem perfil nesta UASG")
        uasg_atual = {"id": uasg.id, "codigo": uasg.codigo, "nome": uasg.nome}
    else:
        profiles = ["SUPER_ADMIN"]

    payload = {
        "user_id": user.id,
        "login": user.login,
        "nome": user.nome,
        "is_super_admin": is_super_admin,
        "uasg_atual": uasg_atual,
        "perfis": profiles,
    }
    token = create_access_token(payload)
    log_action(db, user_id=user.id, uasg_id=uasg_atual["id"] if uasg_atual else None, acao="LOGIN", entidade="AUTH", ip=request.client.host if request.client else None)
    return {"access_token": token, "session": {**payload, "deve_trocar_senha": user.deve_trocar_senha}}


@router.get("/me")
def me(session=Depends(get_current_session)):
    return session


@router.post("/change-password")
def change_password(data: ChangePasswordRequest, session=Depends(get_current_session), db: Session = Depends(get_db)):
    user = db.query(User).get(session["user_id"])
    if not verify_password(data.senha_atual, user.senha_hash):
        raise HTTPException(status_code=400, detail="Senha atual inválida")
    user.senha_hash = get_password_hash(data.nova_senha)
    user.deve_trocar_senha = False
    db.commit()
    return {"message": "Senha alterada"}

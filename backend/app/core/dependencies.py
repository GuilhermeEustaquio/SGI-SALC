from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.profile import Profile, UserUasgProfile
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_session(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: int = payload.get("user_id")
    except JWTError as exc:
        raise credentials_exception from exc
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.ativo:
        raise HTTPException(status_code=401, detail="Usuário inválido ou bloqueado")
    return payload


def require_super_admin(session=Depends(get_current_session)):
    if not session.get("is_super_admin"):
        raise HTTPException(status_code=403, detail="Acesso negado")
    return session


def get_user_profiles(db: Session, user_id: int, uasg_id: int):
    rows = (
        db.query(Profile.nome)
        .join(UserUasgProfile, Profile.id == UserUasgProfile.profile_id)
        .filter(UserUasgProfile.user_id == user_id, UserUasgProfile.uasg_id == uasg_id, UserUasgProfile.ativo.is_(True))
        .all()
    )
    return [r[0] for r in rows]

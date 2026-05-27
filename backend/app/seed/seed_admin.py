from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.profile import Profile
from app.models.user import User

PROFILES = ["SUPER_ADMIN", "ADMIN_UASG", "SALC", "REQUISITANTE", "FISCAL_CONTRATO", "CONSULTA"]


def run_seed(db: Session):
    for p in PROFILES:
        if not db.query(Profile).filter_by(nome=p).first():
            db.add(Profile(nome=p, descricao=f"Perfil {p}"))
    db.commit()

    admin = db.query(User).filter_by(login=settings.admin_initial_login).first()
    if not admin:
        admin = User(
            nome="Administrador",
            login=settings.admin_initial_login,
            email="admin@salc.local",
            cpf="000.000.000-00",
            senha_hash=get_password_hash(settings.admin_initial_password),
            ativo=True,
            deve_trocar_senha=True,
        )
        db.add(admin)
        db.commit()

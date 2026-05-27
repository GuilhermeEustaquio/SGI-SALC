from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, UniqueConstraint, func

from app.core.database import Base


class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True)
    nome = Column(String(50), unique=True, nullable=False)
    descricao = Column(String(255), nullable=True)


class UserUasgProfile(Base):
    __tablename__ = "user_uasg_profiles"
    __table_args__ = (UniqueConstraint("user_id", "uasg_id", "profile_id", name="uq_user_uasg_profile"),)
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    uasg_id = Column(Integer, ForeignKey("uasgs.id"), nullable=False)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

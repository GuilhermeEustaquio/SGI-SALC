from sqlalchemy import Boolean, Column, DateTime, Integer, String, func

from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    nome = Column(String(255), nullable=False)
    login = Column(String(80), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)
    deve_trocar_senha = Column(Boolean, default=False, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

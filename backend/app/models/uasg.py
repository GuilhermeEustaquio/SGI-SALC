from sqlalchemy import Boolean, Column, DateTime, Integer, String, func

from app.core.database import Base


class Uasg(Base):
    __tablename__ = "uasgs"
    id = Column(Integer, primary_key=True)
    codigo = Column(String(20), unique=True, nullable=False)
    nome = Column(String(255), nullable=False)
    orgao = Column(String(255), nullable=False)
    ativa = Column(Boolean, default=True, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

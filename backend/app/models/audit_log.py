from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB

from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    uasg_id = Column(Integer, ForeignKey("uasgs.id"), nullable=True)
    acao = Column(String(80), nullable=False)
    entidade = Column(String(80), nullable=False)
    entidade_id = Column(String(80), nullable=True)
    detalhes = Column(JSONB, nullable=True)
    ip = Column(String(80), nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

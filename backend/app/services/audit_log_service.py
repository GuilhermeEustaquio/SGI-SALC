from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def log_action(db: Session, *, user_id: int | None, uasg_id: int | None, acao: str, entidade: str, entidade_id: str | None = None, detalhes: dict | None = None, ip: str | None = None):
    log = AuditLog(user_id=user_id, uasg_id=uasg_id, acao=acao, entidade=entidade, entidade_id=entidade_id, detalhes=detalhes, ip=ip)
    db.add(log)
    db.commit()

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_session, get_user_profiles
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.uasg import Uasg
from app.models.user import User
from app.schemas.auth import ChangePasswordRequest, LoginRequest, TokenResponse
from app.services.audit_log_service import log_action

router = APIRouter(prefix='/auth', tags=['auth'])

@router.post('/login', response_model=TokenResponse)
def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.login == data.login).first()
    if not user or not verify_password(data.senha, user.senha_hash):
        raise HTTPException(status_code=401, detail='Login ou senha inválidos')
    if not user.ativo:
        raise HTTPException(status_code=403, detail='Usuário bloqueado')

    is_super_admin = user.login == 'admin'
    uasg_input = (data.uasg or '').strip().upper()
    uasg_atual = None
    profiles = ['SUPER_ADMIN'] if is_super_admin else []

    if not is_super_admin:
        if not data.uasg:
            raise HTTPException(status_code=400, detail='UASG obrigatória para usuários comuns')
        uasg = db.query(Uasg).filter(Uasg.codigo == data.uasg, Uasg.ativa.is_(True)).first()
        if not uasg:
            raise HTTPException(status_code=404, detail='UASG inválida')
        profiles = get_user_profiles(db, user.id, uasg.id)
        if not profiles:
            raise HTTPException(status_code=403, detail='Usuário sem perfil nesta UASG')
        uasg_atual = {'id': uasg.id, 'codigo': uasg.codigo, 'nome': uasg.nome}
    else:
        if uasg_input and uasg_input != 'MASTER':
            uasg = db.query(Uasg).filter(Uasg.codigo == data.uasg).first()
            if uasg:
                uasg_atual = {'id': uasg.id, 'codigo': uasg.codigo, 'nome': uasg.nome}

    payload = {'user_id': user.id, 'login': user.login, 'nome': user.nome, 'is_super_admin': is_super_admin, 'uasg_atual': uasg_atual, 'perfis': profiles, 'deve_trocar_senha': user.deve_trocar_senha}
    token = create_access_token(payload)
    log_action(db, user_id=user.id, uasg_id=uasg_atual['id'] if uasg_atual else None, acao='LOGIN_SUCESSO', entidade='AUTH', ip=request.client.host if request.client else None)
    return {'access_token': token, 'token_type': 'bearer', 'session': payload}

@router.get('/me')
def me(session=Depends(get_current_session)):
    return session

@router.post('/change-password')
def change_password(data: ChangePasswordRequest, session=Depends(get_current_session), db: Session = Depends(get_db)):
    user = db.get(User, session['user_id'])
    if not user or not verify_password(data.senha_atual, user.senha_hash):
        raise HTTPException(status_code=400, detail='Senha atual inválida')
    user.senha_hash = get_password_hash(data.nova_senha)
    user.deve_trocar_senha = False
    db.commit()
    log_action(db, user_id=user.id, uasg_id=session.get('uasg_atual',{}).get('id') if isinstance(session.get('uasg_atual'), dict) else None, acao='TROCA_SENHA', entidade='AUTH')
    return {'message':'Senha alterada com sucesso'}

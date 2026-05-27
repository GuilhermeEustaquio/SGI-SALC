# Sistema de Gestão SALC por UASG

## Fase 1 e 2 (entregue)
- Monorepo com `frontend/` e `backend/`
- Backend FastAPI + SQLAlchemy + JWT + seed admin
- Frontend React/Vite com login, troca de senha e admin global básico
- Docker Compose com postgres, backend e frontend

## Rodar com Docker
```bash
cp .env.example .env
docker compose up --build
```

## Rodar local (sem Docker)
### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Login inicial
- login: `admin`
- senha: `Salc1234`
- no primeiro login: troca obrigatória de senha

## Observações
- Alembic está preparado como estrutura inicial; nesta fase as tabelas são criadas em startup para acelerar bootstrap.
- Fases 3+ vão expandir CRUD completo, vínculos e logs detalhados.

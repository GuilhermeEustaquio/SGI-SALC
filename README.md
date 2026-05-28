# SGI-SALC

## Requisitos
- Python **3.12.x** (não usar Python 3.14 por enquanto)
- Node.js 18+
- Docker Desktop

## Backend (FastAPI + Alembic)
```bash
cd backend
cp .env.example .env
py -3.12 -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
```

Subir PostgreSQL:
```bash
cd ..
docker compose up postgres -d
```

Executar migrations e backend:
```bash
cd backend
python -m alembic upgrade head
python -m uvicorn app.main:app --reload
```

> O `alembic.ini` já está versionado com seções de logging completas. Não é necessário ajuste manual para evitar `KeyError: 'formatters'`.

## Frontend (Vite + React + TypeScript)
```bash
cd frontend
cp .env.example .env
# .env
# VITE_API_URL=http://127.0.0.1:8000
npm install
npm run build
npm run dev
```

## Login master inicial
- UASG: `MASTER`
- Login: `admin`
- Senha: `Salc1234`

Primeiro acesso:
1. Login redireciona para `/trocar-senha`
2. Após trocar senha, redireciona para `/admin-global`

## Observações importantes
- O Swagger `Authorize` padrão (username/password) pode não refletir o login com UASG.
- Teste autenticação por `POST /auth/login` com JSON `{ "uasg": "MASTER", "login": "admin", "senha": "..." }`.
- CORS configurado para `http://localhost:5173` e `http://127.0.0.1:5173`.
- Sessão frontend é validada automaticamente. Sessões antigas/incompatíveis são limpas sem precisar `localStorage.clear()` manual.

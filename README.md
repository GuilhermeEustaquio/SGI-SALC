# SGI-SALC

## Requisitos
- Python **3.12.x** (não usar 3.14 por incompatibilidades atuais)
- Node.js 18+
- Docker Desktop

## Backend
```bash
cd backend
cp .env.example .env
py -3.12 -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload
```

## Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Banco
```bash
docker compose up postgres -d
```

## Login inicial (SUPER_ADMIN)
- UASG: `MASTER` (ou vazio / null)
- Login: `admin`
- Senha: `Salc1234`
- Primeiro acesso redireciona para `/trocar-senha`.

## Fluxo de autenticação
- `POST /auth/login` recebe JSON `{ uasg, login, senha }`.
- Swagger `Authorize` padrão (OAuth2 username/password) **não representa** esse fluxo com UASG; teste via `POST /auth/login` e cole o bearer token manualmente.

## Problemas comuns resolvidos
- Python 3.14 incompatível (usar 3.12).
- `email-validator` ausente.
- `bcrypt` incompatível (fixado em 4.0.1).
- Router duplicado no React (removido BrowserRouter do `main.tsx`).
- Alembic sem `env.py` (estrutura criada).
- Login 200 sem redirecionamento (fluxo corrigido no frontend).

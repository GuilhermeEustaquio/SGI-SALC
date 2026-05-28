from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import SessionLocal
from app.routers import auth, profiles, uasgs, users
from app.seed.seed_admin import run_seed

app = FastAPI(title='Sistema de Gestão SALC por UASG')
app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:5173','http://127.0.0.1:5173'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

for r in [auth.router, uasgs.router, users.router, profiles.router]:
    app.include_router(r)

@app.on_event('startup')
def startup():
    db = SessionLocal(); run_seed(db); db.close()

@app.get('/health')
def health():
    return {'status':'ok'}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.routers import auth, profiles, uasgs, users
from app.seed.seed_admin import run_seed

app = FastAPI(title="Sistema de Gestão SALC por UASG")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(uasgs.router)
app.include_router(users.router)
app.include_router(profiles.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    run_seed(db)
    db.close()


@app.get("/health")
def health():
    return {"status": "ok"}

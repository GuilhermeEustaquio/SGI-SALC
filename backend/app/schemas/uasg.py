from pydantic import BaseModel


class UasgCreate(BaseModel):
    codigo: str
    nome: str
    orgao: str


class UasgOut(BaseModel):
    id: int
    codigo: str
    nome: str
    orgao: str
    ativa: bool

    class Config:
        from_attributes = True

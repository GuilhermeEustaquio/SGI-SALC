from pydantic import BaseModel


class ProfileOut(BaseModel):
    id: int
    nome: str
    descricao: str | None = None

    class Config:
        from_attributes = True

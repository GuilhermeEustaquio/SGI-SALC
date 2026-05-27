from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    nome: str
    login: str
    email: EmailStr
    cpf: str
    senha: str


class UserOut(BaseModel):
    id: int
    nome: str
    login: str
    email: EmailStr
    cpf: str
    ativo: bool
    deve_trocar_senha: bool

    class Config:
        from_attributes = True

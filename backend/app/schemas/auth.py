from pydantic import BaseModel


class LoginRequest(BaseModel):
    uasg: str | None = None
    login: str
    senha: str


class ChangePasswordRequest(BaseModel):
    senha_atual: str
    nova_senha: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    session: dict

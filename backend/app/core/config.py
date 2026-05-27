from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite:///./dev.db"
    secret_key: str = "dev-secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480
    frontend_url: str = "http://localhost:5173"
    admin_initial_login: str = "admin"
    admin_initial_password: str = "Salc1234"


settings = Settings()

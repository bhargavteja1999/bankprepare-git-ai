from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./bankprepare.db"
    SECRET_KEY: str = "dev-secret-key-change-in-prod-32chars!"
    GEMINI_API_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24h
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    APP_NAME: str = "BankPrepare AI"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters. Generate with: openssl rand -hex 32")
        if v == "dev-secret-key-change-in-prod-32chars!":
            import warnings
            warnings.warn("Using default SECRET_KEY - change it in .env for production!")
        return v

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()

import os
from dotenv import load_dotenv

load_dotenv()
import sys


def _env_int(name: str, default: int, minimum: int, maximum: int) -> int:
    raw = os.getenv(name, str(default))
    try:
        value = int(raw)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be an integer") from exc
    if not minimum <= value <= maximum:
        raise RuntimeError(f"{name} must be between {minimum} and {maximum}")
    return value


class Config:
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME", "dockavach_db")
    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_EXP_HOURS = _env_int("JWT_EXP_HOURS", 24, 1, 168)
    PORT = _env_int("PORT", 5000, 1, 65535)
    HOST = os.getenv("HOST", "0.0.0.0")
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    MAX_CONTENT_LENGTH = _env_int("MAX_CONTENT_LENGTH", 16 * 1024 * 1024, 1, 32 * 1024 * 1024)
    FRONTEND_ORIGINS = [origin.strip() for origin in os.getenv("FRONTEND_ORIGIN", "http://localhost:3000").split(",") if origin.strip()]


if not Config.MONGO_URI:
    raise RuntimeError("MONGO_URI missing in .env")
if not Config.JWT_SECRET or len(Config.JWT_SECRET) < 32:
    raise RuntimeError("JWT_SECRET missing or too short; use at least 32 random characters")
if not all(o.startswith(("http://", "https://")) for o in Config.FRONTEND_ORIGINS):
    raise RuntimeError("FRONTEND_ORIGIN must be a comma-separated list of absolute http(s) URLs")

if Config.DEBUG:
    print("WARNING: FLASK_DEBUG is enabled (debug mode). Do not use in production.", file=sys.stderr)
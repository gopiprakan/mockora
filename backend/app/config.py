import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend or root directory
backend_dir = Path(__file__).resolve().parent.parent
root_dir = backend_dir.parent

load_dotenv(backend_dir / ".env")
load_dotenv(root_dir / ".env")

class Settings:
    PROJECT_NAME: str = "Mockora API"
    VERSION: str = "1.0.0"
    
    # AI API Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Email Configuration
    EMAIL_SERVICE: str = os.getenv("EMAIL_SERVICE", "smtp")
    EMAIL_API_KEY: str = os.getenv("EMAIL_API_KEY", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "hello@mockora.ai")
    EMAIL_FROM_NAME: str = os.getenv("EMAIL_FROM_NAME", "Mockora AI Coach")
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    
    # Server & Security
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Local Storage paths
    UPLOAD_DIR: Path = backend_dir / "uploads"
    DATA_DIR: Path = backend_dir / "data"

settings = Settings()
try:
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
except OSError:
    # Serverless / read-only filesystem environment (e.g. Vercel)
    import tempfile
    tmp_base = Path(tempfile.gettempdir()) / "mockora"
    settings.UPLOAD_DIR = tmp_base / "uploads"
    settings.DATA_DIR = tmp_base / "data"
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    settings.DATA_DIR.mkdir(parents=True, exist_ok=True)

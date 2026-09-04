import os
from pydantic_settings import BaseSettings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DATA_DIR = os.path.join(BASE_DIR, "data")
KB_DIR = os.path.join(DATA_DIR, "knowledge_base")
STRUCTURED_DIR = os.path.join(DATA_DIR, "structured")
CHROMA_DIR = os.path.join(DATA_DIR, "chroma_db")

class Settings(BaseSettings):
    PROJECT_NAME: str = "BIS AI Intelligent Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # LLM Provider: 'gemini', 'openai', 'groq', 'offline'
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Embedding Model
    EMBEDDING_MODEL: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    CHROMA_COLLECTION: str = "bis_standards_kb"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(DATA_DIR, 'bis_assistant.db')}")
    
    # Directories
    BASE_DIR: str = BASE_DIR
    DATA_DIR: str = DATA_DIR
    KB_DIR: str = KB_DIR
    STRUCTURED_DIR: str = STRUCTURED_DIR
    CHROMA_DIR: str = CHROMA_DIR

    class Config:
        case_sensitive = True

settings = Settings()

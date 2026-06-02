import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "TruthLens AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # HuggingFace API Token
    HF_API_URL: str = "https://dipaghosh56-electra-ai-vs-human.hf.space/api/predict"
    HF_TOKEN: str = os.getenv("HF_TOKEN", "YOUR_HF_TOKEN_HERE")
    
    TRANSLATE_API_URL: str = "https://translate.googleapis.com/translate_a/single"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["*"]

settings = Settings()

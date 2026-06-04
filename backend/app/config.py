from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", env_file_encoding="utf-8")

    PROJECT_NAME: str = "TruthLens AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # HuggingFace
    HF_API_URL: str = "https://dipaghosh56-electra-ai-vs-human.hf.space/api/predict"
    HF_TOKEN: str = ""

    # Translation
    TRANSLATE_API_URL: str = "https://translate.googleapis.com/translate_a/single"

    # CORS – allow everything so the Render frontend can reach us
    BACKEND_CORS_ORIGINS: list[str] = ["*"]


settings = Settings()

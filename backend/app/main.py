from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.ai import router as ai_router

app = FastAPI(
    title="School Asset Management API",
    version="1.0.0",
    description="Backend API and AI Agent for school asset management.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(ai_router)



@app.get("/")
def root():
    return {"message": "School Asset Management API is running"}

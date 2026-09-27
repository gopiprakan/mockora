from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import resume, interview, report

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Mockora AI Mock Interview Assistant API"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(report.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "app": "Mockora AI Interview Assistant",
        "gemini_active": bool(settings.GEMINI_API_KEY),
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)

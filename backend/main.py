from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, excel, analytics, ingestion

# Register Celery tasks
import tasks.excel_tasks  # noqa: F401

app = FastAPI(title="Hugamara CEO Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(excel.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(ingestion.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Hugamara CEO Portal API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

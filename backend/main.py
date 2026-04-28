"""
FAIRCHAT Backend — FastAPI Application Entry Point

Conversational AI Bias Detection System
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import route modules
from routes.upload import router as upload_router
from routes.analyze import router as analyze_router
from routes.chat import router as chat_router

# --- App Initialization ---
app = FastAPI(
    title="FAIRCHAT API",
    description="Conversational AI Bias Detection System — Detect, explain, and fix bias in your datasets.",
    version="1.0.0",
)

# --- CORS Middleware ---
# Allow the React dev server and Firebase hosting origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mount Routers ---
app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(analyze_router, prefix="/api", tags=["Analysis"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])


# --- Health Check ---
@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": "FAIRCHAT API",
        "version": "1.0.0",
        "message": "Conversational AI Bias Detection System is running.",
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Detailed health check."""
    import os
    gemini_configured = bool(
        os.getenv("GEMINI_API_KEY")
        and os.getenv("GEMINI_API_KEY") != "your_gemini_api_key_here"
    )

    return {
        "status": "healthy",
        "gemini_api": "configured" if gemini_configured else "not configured",
        "message": "All systems operational.",
    }

"""
Chat route — conversational AI interface powered by Gemini.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.gemini_service import chat_with_gemini

router = APIRouter()


class ChatRequest(BaseModel):
    """Request body for the chat endpoint."""
    message: str
    context: Optional[dict] = None       # Bias analysis results
    history: Optional[list] = None       # Previous chat messages


class ChatResponse(BaseModel):
    """Response body from the chat endpoint."""
    response: str
    success: bool = True


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with the AI about bias analysis results.
    Sends the user's message along with analysis context to Gemini.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        response_text = await chat_with_gemini(
            user_message=request.message,
            analysis_context=request.context,
            chat_history=request.history,
        )

        return ChatResponse(response=response_text, success=True)

    except Exception as e:
        print(f"Chat error: {e}")
        return ChatResponse(
            response="I'm having trouble processing your request right now. "
                     "Please try again in a moment.",
            success=False,
        )

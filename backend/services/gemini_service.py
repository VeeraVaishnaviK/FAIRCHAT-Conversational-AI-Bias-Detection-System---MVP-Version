"""
Gemini API integration service.

Uses the google-genai SDK to communicate with Google's Gemini models
for conversational bias explanation.
"""

import os
import json
from dotenv import load_dotenv

load_dotenv()

# System prompt for the FAIRCHAT assistant
SYSTEM_PROMPT = """You are FAIRCHAT, an AI assistant specialized in explaining data bias and fairness.

Your communication style:
1. Use simple, everyday language — explain as if talking to a high school student
2. Avoid technical jargon; when you must use a technical term, define it immediately
3. Be empathetic and constructive — never alarmist or judgmental
4. Always provide 2-3 actionable, concrete suggestions
5. Use analogies and real-world examples to make concepts relatable
6. Keep responses concise but thorough (aim for 3-5 paragraphs)

When given bias analysis results, explain:
- What the numbers mean in plain English
- Why this matters in real-world decision making
- What specific steps can be taken to improve fairness

Remember: The goal is to empower users to make their data and decisions more fair."""


def get_gemini_client():
    """Initialize and return the Gemini client."""
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key or api_key == "your_gemini_api_key_here":
        return None

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        return client
    except Exception as e:
        print(f"Failed to initialize Gemini client: {e}")
        return None


async def chat_with_gemini(
    user_message: str,
    analysis_context: dict = None,
    chat_history: list = None,
) -> str:
    """
    Send a message to Gemini with bias analysis context.

    Args:
        user_message: The user's question or message
        analysis_context: Optional bias analysis results for context
        chat_history: Optional list of previous messages

    Returns:
        The AI's response as a string
    """
    client = get_gemini_client()

    if not client:
        return generate_fallback_response(user_message, analysis_context)

    try:
        # Build the prompt with context
        prompt_parts = [SYSTEM_PROMPT + "\n\n"]

        # Add analysis context if available
        if analysis_context:
            context_str = json.dumps(analysis_context, indent=2, default=str)
            prompt_parts.append(
                f"Here are the current bias analysis results for reference:\n"
                f"```json\n{context_str}\n```\n\n"
            )

        # Add chat history if available
        if chat_history:
            prompt_parts.append("Previous conversation:\n")
            for msg in chat_history[-6:]:  # Last 6 messages for context
                role = msg.get("role", "user")
                content = msg.get("content", "")
                prompt_parts.append(f"{role.upper()}: {content}\n")
            prompt_parts.append("\n")

        # Add the current user message
        prompt_parts.append(f"USER: {user_message}\n\nASSISTANT:")

        full_prompt = "".join(prompt_parts)

        # Call Gemini API
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt,
        )

        return response.text

    except Exception as e:
        print(f"Gemini API error: {e}")
        return generate_fallback_response(user_message, analysis_context)


def generate_fallback_response(
    user_message: str, analysis_context: dict = None
) -> str:
    """
    Generate a helpful fallback response when Gemini API is unavailable.
    Uses the analysis context to provide relevant information.
    """
    msg_lower = user_message.lower()

    if not analysis_context:
        return (
            "I don't have any analysis results to discuss yet. "
            "Please upload a CSV file and run the bias analysis first, "
            "then come back to chat about the results!"
        )

    bias_level = analysis_context.get("bias_level", "Unknown")
    score = analysis_context.get("fairness_score", "N/A")
    affected = analysis_context.get("affected_features", [])
    explanation = analysis_context.get("explanation", "")

    # Route based on user intent
    if any(word in msg_lower for word in ["what", "explain", "mean", "understand"]):
        return (
            f"Based on the analysis, your dataset has a **{bias_level}** bias level "
            f"with a fairness score of **{score}/100**.\n\n"
            f"{explanation}\n\n"
            f"Would you like to know how to improve this score?"
        )
    elif any(word in msg_lower for word in ["fix", "improve", "solve", "help", "do"]):
        suggestions = analysis_context.get("suggestions", [])
        if suggestions:
            return "Here are some suggestions to improve fairness:\n\n" + "\n\n".join(
                suggestions[:3]
            )
        return (
            "To improve fairness, consider:\n"
            "1. Collecting more balanced data across all groups\n"
            "2. Reviewing and potentially removing biased features\n"
            "3. Applying fairness-aware machine learning techniques"
        )
    elif any(word in msg_lower for word in ["score", "fair", "level"]):
        return (
            f"Your fairness score is **{score}/100** (Bias Level: **{bias_level}**).\n\n"
            f"- Scores above 70 indicate low bias ✅\n"
            f"- Scores between 40-70 indicate moderate bias ⚠️\n"
            f"- Scores below 40 indicate high bias 🔴\n\n"
            f"The affected features are: {', '.join(affected) if affected else 'None detected'}"
        )
    else:
        return (
            f"I'm here to help you understand your bias analysis results! "
            f"Your dataset currently has a **{bias_level}** bias level "
            f"(score: {score}/100).\n\n"
            f"You can ask me things like:\n"
            f"- \"What does this bias mean?\"\n"
            f"- \"How can I fix the bias?\"\n"
            f"- \"Explain the fairness score\"\n"
            f"- \"What features are causing bias?\""
        )

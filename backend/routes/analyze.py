"""
Analyze route — runs bias detection on an uploaded CSV.
"""

from fastapi import APIRouter, HTTPException, Query
from utils.helpers import load_csv
from services.bias_detector import run_full_analysis
from services.suggestion_engine import generate_suggestions

router = APIRouter()


@router.get("/analyze")
async def analyze_csv(filename: str = Query(..., description="The filename returned from /upload")):
    """
    Analyze an uploaded CSV file for bias.
    Returns bias level, fairness score, affected features,
    explanations, and actionable suggestions.
    """
    # Load the CSV
    try:
        df = load_csv(filename)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"File '{filename}' not found. Please upload it first.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading file: {str(e)}",
        )

    # Run bias analysis
    try:
        analysis = run_full_analysis(df)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis error: {str(e)}",
        )

    # Generate suggestions
    try:
        suggestions = generate_suggestions(analysis)
        analysis["suggestions"] = suggestions
    except Exception as e:
        analysis["suggestions"] = [
            "Unable to generate suggestions at this time."
        ]

    return analysis

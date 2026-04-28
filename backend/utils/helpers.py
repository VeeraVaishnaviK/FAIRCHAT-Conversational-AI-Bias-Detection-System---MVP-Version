"""
Utility helpers for CSV validation and temporary file management.
"""

import os
import uuid
import pandas as pd
from pathlib import Path

# Temporary upload directory
UPLOAD_DIR = Path(__file__).parent.parent / "temp_uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


def validate_csv(file_content: bytes, filename: str) -> dict:
    """
    Validate that the uploaded file is a proper CSV.
    Returns a dict with validation result and details.
    """
    if not filename.lower().endswith(".csv"):
        return {"valid": False, "error": "File must have a .csv extension"}

    try:
        # Try reading the CSV content
        from io import BytesIO
        df = pd.read_csv(BytesIO(file_content))

        if df.empty:
            return {"valid": False, "error": "CSV file is empty"}

        if len(df.columns) < 2:
            return {"valid": False, "error": "CSV must have at least 2 columns"}

        return {
            "valid": True,
            "columns": list(df.columns),
            "rows": len(df),
            "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        }

    except pd.errors.EmptyDataError:
        return {"valid": False, "error": "CSV file is empty or malformed"}
    except pd.errors.ParserError:
        return {"valid": False, "error": "Unable to parse the CSV file"}
    except Exception as e:
        return {"valid": False, "error": f"Validation error: {str(e)}"}


def save_temp_file(file_content: bytes, original_filename: str) -> str:
    """
    Save uploaded file to temp directory with a unique name.
    Returns the saved filename.
    """
    # Generate a unique filename to avoid collisions
    ext = Path(original_filename).suffix
    unique_name = f"{uuid.uuid4().hex[:12]}_{original_filename}"
    filepath = UPLOAD_DIR / unique_name

    with open(filepath, "wb") as f:
        f.write(file_content)

    return unique_name


def get_temp_filepath(filename: str) -> Path:
    """Get the full path to a temp file."""
    return UPLOAD_DIR / filename


def load_csv(filename: str) -> pd.DataFrame:
    """Load a CSV from the temp directory into a DataFrame."""
    filepath = get_temp_filepath(filename)
    if not filepath.exists():
        raise FileNotFoundError(f"File '{filename}' not found")
    return pd.read_csv(filepath)


def cleanup_temp_file(filename: str) -> bool:
    """Remove a temp file. Returns True if successful."""
    filepath = get_temp_filepath(filename)
    if filepath.exists():
        os.remove(filepath)
        return True
    return False


def get_csv_preview(df: pd.DataFrame, max_rows: int = 5) -> list:
    """Get a preview of the first N rows as a list of dicts."""
    return df.head(max_rows).to_dict(orient="records")

"""
Upload route — handles CSV file uploads with validation.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.helpers import validate_csv, save_temp_file, load_csv, get_csv_preview

router = APIRouter()


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload a CSV file for bias analysis.
    Validates the file and stores it temporarily.
    """
    # Read file content
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    # Validate CSV
    validation = validate_csv(content, file.filename)

    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["error"])

    # Save to temp directory
    saved_filename = save_temp_file(content, file.filename)

    # Get a preview
    df = load_csv(saved_filename)
    preview = get_csv_preview(df)

    return {
        "success": True,
        "filename": saved_filename,
        "original_name": file.filename,
        "columns": validation["columns"],
        "rows": validation["rows"],
        "dtypes": validation["dtypes"],
        "preview": preview,
    }

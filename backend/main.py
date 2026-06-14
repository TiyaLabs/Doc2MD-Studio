import os
import tempfile
import asyncio
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from markitdown import MarkItDown
import openai

# Load environment variables
load_dotenv()

# Constants
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", 25))
MAX_TOTAL_UPLOAD_MB = int(os.getenv("MAX_TOTAL_UPLOAD_MB", 100))
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
MAX_TOTAL_UPLOAD_BYTES = MAX_TOTAL_UPLOAD_MB * 1024 * 1024

app = FastAPI(title="MarkItDown Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

md = MarkItDown()

@app.get("/")
def health_check():
    return {"status": "ok", "message": "MarkItDown Studio Backend is running."}

async def _validate_files(files: List[UploadFile]):
    total_size = 0
    for file in files:
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)
        
        if size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File {file.filename} exceeds the maximum allowed size of {MAX_FILE_SIZE_MB}MB."
            )
        total_size += size
        
    if total_size > MAX_TOTAL_UPLOAD_BYTES:
         raise HTTPException(
             status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
             detail=f"Total upload size exceeds the maximum allowed size of {MAX_TOTAL_UPLOAD_MB}MB."
         )

def _sync_convert(content: bytes, filename: str, openai_api_key: str = None) -> dict:
    temp_file_path = ""
    try:
        suffix = os.path.splitext(filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Use OCR / LLM capabilities if api key is provided
        if openai_api_key and openai_api_key.strip():
            client = openai.OpenAI(api_key=openai_api_key.strip())
            local_md = MarkItDown(llm_client=client, llm_model="gpt-4o")
            result = local_md.convert(temp_file_path)
        else:
            result = md.convert(temp_file_path)
            
        return {
            "filename": filename,
            "markdown": result.text_content,
            "status": "success",
            "error": None
        }
    except Exception as e:
        return {
            "filename": filename,
            "markdown": None,
            "status": "error",
            "error": str(e)
        }
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

async def convert_single_file_async(file: UploadFile, openai_api_key: str = None):
    content = await file.read()
    return await asyncio.to_thread(_sync_convert, content, file.filename, openai_api_key)

@app.post("/api/convert")
async def convert_files(
    files: List[UploadFile] = File(...),
    openai_api_key: Optional[str] = Form(None)
):
    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="No files uploaded.")
        
    await _validate_files(files)
    
    # Run conversions concurrently in threads
    tasks = [convert_single_file_async(file, openai_api_key) for file in files]
    results = await asyncio.gather(*tasks)
        
    return {"results": results}

@app.post("/api/convert-merge")
async def convert_merge_files(
    files: List[UploadFile] = File(...),
    openai_api_key: Optional[str] = Form(None)
):
    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="No files uploaded.")
        
    await _validate_files(files)
    
    # Run conversions concurrently in threads
    tasks = [convert_single_file_async(file, openai_api_key) for file in files]
    results = await asyncio.gather(*tasks)
    
    merged_markdown = ""
    for res in results:
        if res["status"] == "success":
            merged_markdown += f"## Source: {res['filename']}\n\n{res['markdown']}\n\n---\n\n"
            
    return {
        "merged_markdown": merged_markdown,
        "results": results
    }

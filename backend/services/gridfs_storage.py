from __future__ import annotations

import io
from typing import Any

import pandas as pd
from bson import ObjectId
from fastapi.responses import StreamingResponse

from database.mongodb import get_gridfs_bucket


class GridFSStorage:
    async def save_file(self, file_content: bytes, filename: str, content_type: str, metadata: dict[str, Any]):
        bucket = get_gridfs_bucket()
        file_id = await bucket.upload_from_stream(
            filename,
            io.BytesIO(file_content),
            metadata=metadata,
            content_type=content_type,
        )
        return file_id

    async def open_download_stream(self, file_id: str):
        bucket = get_gridfs_bucket()
        return await bucket.open_download_stream(ObjectId(file_id))

    async def stream_file_response(self, file_id: str, filename: str | None = None):
        stream = await self.open_download_stream(file_id)
        out_filename = filename or getattr(stream, "filename", "download.xlsx")

        return StreamingResponse(
            stream,
            media_type=getattr(stream, "content_type", "application/octet-stream"),
            headers={"Content-Disposition": f"attachment; filename=\"{out_filename}\""},
        )

    async def get_file_preview(self, file_id: str, rows: int = 10):
        stream = await self.open_download_stream(file_id)
        content = await stream.read()
        df = pd.read_excel(io.BytesIO(content), sheet_name=0)
        preview_df = df.head(rows)
        return {
            "columns": [str(c) for c in preview_df.columns.tolist()],
            "rows": preview_df.fillna("").astype(str).values.tolist(),
        }


gridfs_storage = GridFSStorage()

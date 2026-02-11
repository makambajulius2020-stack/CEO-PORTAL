import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket

MONGODB_URL = os.getenv("MONGODB_URL")
if not MONGODB_URL:
    raise RuntimeError("MONGODB_URL is not set")

_client: AsyncIOMotorClient | None = None


def get_mongo_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGODB_URL)
    return _client


def get_mongo_db_name() -> str:
    # For mongodb://.../<db> URLs, Motor resolves the default DB via get_default_database.
    # If URL has no db, fall back.
    return os.getenv("MONGODB_DB", "hugamara_logs")


def get_mongo_db():
    client = get_mongo_client()
    try:
        return client.get_default_database()
    except Exception:
        return client[get_mongo_db_name()]


def get_gridfs_bucket(bucket_name: str = "excel_files") -> AsyncIOMotorGridFSBucket:
    db = get_mongo_db()
    return AsyncIOMotorGridFSBucket(db, bucket_name=bucket_name)

from fastapi import APIRouter, Query
from app.services.youtube_service import search_youtube_videos

router = APIRouter(prefix="/videos", tags=["videos"])

@router.get("/")
async def get_videos(query: str = Query(..., min_length=1)):
    """Fetch YouTube videos based on search query."""
    videos = await search_youtube_videos(query)
    return videos
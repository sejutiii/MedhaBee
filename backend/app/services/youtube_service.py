import os
import re
from dotenv import load_dotenv
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from fastapi import HTTPException

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def format_duration(duration: str) -> str:
    """Convert ISO 8601 duration (e.g., PT12M45S) to MM:SS."""
    match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration)
    if not match:
        return "00:00"
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    total_minutes = hours * 60 + minutes
    return f"{total_minutes:02d}:{seconds:02d}"

async def search_youtube_videos(query: str) -> list:
    """Fetch YouTube videos for the given query."""
    if not YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YouTube API key not configured")

    try:
        # Initialize YouTube API client
        youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

        # Step 1: Fetch search results
        search_response = youtube.search().list(
            part="snippet",
            q=query + " science",
            type="video",
            maxResults=5  # Reduced from 10 to 5 to save quota
        ).execute()

        video_ids = [item["id"]["videoId"] for item in search_response.get("items", [])]
        if not video_ids:
            return []

        # Step 2: Fetch video details for duration and views
        videos_response = youtube.videos().list(
            part="contentDetails,statistics",
            id=",".join(video_ids)
        ).execute()

        # Combine search and video details
        videos = [
            {
                "id": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                "duration": format_duration(videos_response["items"][index]["contentDetails"]["duration"]),
                "channel": item["snippet"]["channelTitle"],
                "views": f"{int(videos_response['items'][index]['statistics']['viewCount']) // 1000}K",
                "videoUrl": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "category": "search",
            }
            for index, item in enumerate(search_response["items"])
        ]
        return videos

    except HttpError as e:
        raise HTTPException(status_code=500, detail=f"YouTube API error: {str(e)}")
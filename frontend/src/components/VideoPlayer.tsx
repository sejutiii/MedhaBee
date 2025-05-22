import { useState, useEffect } from "react";

type VideoPlayerProps = {
  videoUrl: string;
  title: string;
  onClose?: () => void;
};

// Helper function to extract YouTube video ID from URL
const getYoutubeVideoId = (url: string) => {
  if (!url) return null;

  // For standard youtube.com/watch?v= URLs
  if (url.includes("youtube.com/watch")) {
    const urlParams = new URL(url).searchParams;
    const id = urlParams.get("v");
    if (id) return id;
  }

  // For youtu.be/ short URLs
  if (url.includes("youtu.be/")) {
    const segments = url.split("/");
    const id = segments[segments.length - 1].split("?")[0];
    if (id) return id;
  }

  // Try regex as a fallback
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function VideoPlayer({
  videoUrl,
  title,
  onClose,
}: VideoPlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (videoUrl) {
      const id = getYoutubeVideoId(videoUrl);
      setVideoId(id);
    }
  }, [videoUrl]);

  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white p-4 rounded-md">
        Unable to load video. Invalid video URL.
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gray-900 rounded-md overflow-hidden">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-gray-700"
          aria-label="Close video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <iframe
        title={title}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      ></iframe>
    </div>
  );
}

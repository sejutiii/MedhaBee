"use client";

import { useState, useRef, useEffect } from "react";

// @ts-ignore
let Recorder: any = null;

export default function RecorderWithSTTPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [sttLanguage, setSttLanguage] = useState("en");
  
  const recorderRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);

  const startRecording = async () => {
    setError(null);
    setDownloadUrl(null);
    setTranscribedText("");
    recordedBlobRef.current = null;

    try {
      // Dynamically load Recorder.js if not loaded
      if (!Recorder) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/recorder.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
        // @ts-ignore
        Recorder = window.Recorder;
      }

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create audio context and recorder
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      const input = audioContext.createMediaStreamSource(stream);
      
      // Configure recorder for Azure Speech API requirements
      const recorder = new Recorder(input, { 
        workerPath: '/recorderWorker.js',
        numChannels: 1,
        sampleRate: 16000,
        bufferLen: 4096
      });
      recorderRef.current = recorder;

      // Start recording
      recorder.record();
      setIsRecording(true);
      console.log("Recording started");

    } catch (err: any) {
      setError("Failed to access microphone: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      
      // Export the recorded audio as WAV
      recorderRef.current.exportWAV(async (blob: Blob) => {
        recordedBlobRef.current = blob;
        console.log("Recording stopped, WAV blob created:", blob);
        
        // Create download URL
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);

        // Send audio file to backend for STT
        try {
          const formData = new FormData();
          formData.append("audio", blob, "recorded-audio.wav");
          formData.append("language", sttLanguage);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stt`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log("STT result:", result);
          setTranscribedText(result.text || "No transcription available");
        } catch (err: any) {
          setError("Failed to transcribe audio: " + (err instanceof Error ? err.message : String(err)));
        }
      });
      
      recorderRef.current.clear();
      recorderRef.current = null;
    }

    // Clean up media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      streamRef.current = null;
    }

    // Clean up audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsRecording(false);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stop();
        recorderRef.current.clear();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Audio Recorder with Speech-to-Text</h1>

      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Record & Transcribe Audio</h2>
        
        <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <label htmlFor="sttLanguage" className="block text-gray-600 mb-2">
              Select Language:
            </label>
            <select
              id="sttLanguage"
              value={sttLanguage}
              onChange={(e) => setSttLanguage(e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
              disabled={isRecording}
            >
              <option value="en">English</option>
              <option value="bn">Bangla</option>
            </select>
          </div>

          {/* Control Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={startRecording}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
              disabled={isRecording}
            >
              {isRecording ? "Recording..." : "Start Recording"}
            </button>
            
            <button
              onClick={stopRecording}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
              disabled={!isRecording}
            >
              Stop Recording
            </button>
          </div>

          {/* Status Display */}
          <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded">
            <div>Recording Status: {isRecording ? "Active" : "Inactive"}</div>
            <div>Stream Active: {streamRef.current ? "Yes" : "No"}</div>
            <div>Audio Ready: {recordedBlobRef.current ? "Yes" : "No"}</div>
          </div>

          {/* Transcribed Text Display */}
          {transcribedText && (
            <div className="mt-4 p-4 bg-blue-50 rounded shadow">
              <h3 className="font-semibold text-gray-700 mb-2">Transcribed Text:</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{transcribedText}</p>
            </div>
          )}

          {/* Download Button */}
          {downloadUrl && (
            <div className="mt-4">
              <a
                href={downloadUrl}
                download="recorded-audio.wav"
                className="w-full block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download Recorded Audio
              </a>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Click to download and verify your recording
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}
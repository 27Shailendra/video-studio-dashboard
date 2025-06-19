
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, ArrowLeft } from "lucide-react";
import { fetchVideoByShortId, trimApi } from "../api/auth";
import VideoTrimmer from "@/components/VideoTrimmer";

const Edit = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [videoURL, setVideoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoData,setVideoData]=useState();

    const fetchVideo = async () => {
      setLoading(true);
    try {
      const res = await fetchVideoByShortId(videoId);
      if (!res) {
        throw new Error(`Failed to fetch video: ${res}`);
      }
      console.log(res);
      setVideoData(res);
      setVideoURL(res?.url);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching videos', err);
    }
  };

  useEffect(()=>{
    if(videoId){
      fetchVideo();
    }
  },[videoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Error: {error}</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!videoURL) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>No video found</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Video Editor</span>
          </div>
          <div></div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <VideoTrimmer videoURL={videoURL} videoData={videoData} trimApi={trimApi}/>
        </div>
      </div>
    </div>
  );
};

export default Edit;
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, SkipBack, SkipForward, Volume2, Save, Download } from "lucide-react";
import { toast } from "sonner";

interface VideoTrimmerProps {
  videoURL: string; 
  videoData?: any;
  trimApi?: any;
}

const VideoTrimmer: React.FC<VideoTrimmerProps> = ({ videoURL, videoData, trimApi }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<string>(videoData?.aspectRatio || "16:9");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveAsNewName, setSaveAsNewName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number[]>([100]);
  const [isDragging, setIsDragging] = useState<string | null>(null);

 const aspectRatios = [
    { label: "16:9 (Default)", value: "16:9" },
    { label: "1:1 (Square)", value: "1:1" },
    { label: "3:4 (Portrait)", value: "3:4" },
    { label: "9:16 (Vertical)", value: "9:16" }
  ];

  const getAspectRatioOverlay = () => {
    if (!videoRef.current) return { width: 0, height: 0, top: 0, left: 0 };
    
    const videoElement = videoRef.current;
    const videoRect = videoElement.getBoundingClientRect();
    const videoWidth = videoRect.width;
    const videoHeight = videoRect.height;
    
    let overlayWidth, overlayHeight;
    
    switch (aspectRatio) {
      case "1:1":
        const squareSize = Math.min(videoWidth, videoHeight);
        overlayWidth = squareSize;
        overlayHeight = squareSize;
        break;
      case "3:4":
        if (videoWidth / videoHeight > 3/4) {
          overlayHeight = videoHeight;
          overlayWidth = overlayHeight * (3/4);
        } else {
          overlayWidth = videoWidth;
          overlayHeight = overlayWidth * (4/3);
        }
        break;
      case "9:16":
        if (videoWidth / videoHeight > 9/16) {
          overlayHeight = videoHeight;
          overlayWidth = overlayHeight * (9/16);
        } else {
          overlayWidth = videoWidth;
          overlayHeight = overlayWidth * (16/9);
        }
        break;
      case "16:9":
      default:
        if (videoWidth / videoHeight > 16/9) {
          overlayHeight = videoHeight;
          overlayWidth = overlayHeight * (16/9);
        } else {
          overlayWidth = videoWidth;
          overlayHeight = overlayWidth * (9/16);
        }
        break;
    }
    
    const top = (videoHeight - overlayHeight) / 2;
    const left = (videoWidth - overlayWidth) / 2;
    
    return { width: overlayWidth, height: overlayHeight, top, left };
  };

  const handleDownloadVideo = async (videoUrl: string | URL | Request, videoName: string) => {
    if (!videoUrl) {
      console.error('No video URL provided');
      return;
    }

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch the video file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;

      const filename = videoName?.endsWith('.mp4')
        ? videoName
        : `${videoName || 'video'}.mp4`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleSaveVideo = async(override: boolean) => {
    console.log(videoData,override);   
     if (!videoData) {
      toast.error("Video data not available");
      return;
    }

    setIsLoading(true);

    if (override) {
      try {
        const result = await trimApi({
          url: videoData.url || videoURL,
          startTime: start,
          endTime: end,
          userId: videoData.userId || 'default-user',
          name: videoData.name,
          aspectRatio,
        });

        if (result.success) {
          toast.success("Video saved successfully!");
          setIsSaveModalOpen(false);
        } else {
          toast.error(result.error || "Failed to save video");
        }
      } catch (error) {
        toast.error("Failed to save video");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!showNameInput) {
        setShowNameInput(true);
        setSaveAsNewName("");
        setIsLoading(false);
      } else {
        if (saveAsNewName.trim()) {
          try {
            const result = await trimApi({
              url: videoData.url || videoURL,
              startTime: start,
              endTime: end,
              userId: videoData.userId || 'default-user',
              name: saveAsNewName.trim(),
              aspectRatio,
            });

            if (result.success) {
              console.log("here",saveAsNewName);
              toast.success(`Video saved as "${saveAsNewName}"!`);
              setIsSaveModalOpen(false);
              setShowNameInput(false);
              setSaveAsNewName("");
            } else {
              toast.error(result.error || "Failed to save video");
            }
          } catch (error) {
            toast.error("Failed to save video");
          } finally {
            setIsLoading(false);
          }
        } else {
          toast.error("Please enter a valid name");
          setIsLoading(false);
        }
      }
    }
  };

  const resetSaveModal = () => {
    setShowNameInput(false);
    setSaveAsNewName("");
    setIsLoading(false);
  };

function secondsToTimestamp(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
   const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setEnd(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.currentTime >= end) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (currentTime >= end) {
          videoRef.current.currentTime = start;
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(start, Math.min(end, time));
    }
  };

  const handleSetStart = () => {
    if (videoRef.current) {
      const t = videoRef.current.currentTime;
      setStart(Number(t.toFixed(2)));
      if (end === 0 || end <= t) setEnd(Number(t.toFixed(2)) + 1);
    }
  };

  const handleSetEnd = () => {
    if (videoRef.current) {
      const t = videoRef.current.currentTime;
      setEnd(Number(t.toFixed(2)));
    }
  };

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (timelineRef.current && duration > 0) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      seekTo(newTime);
    }
  }, [duration, start, end]);

  const handleMouseDown = (type: 'start' | 'end') => {
    setIsDragging(type);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && timelineRef.current && duration > 0) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;

      if (isDragging === 'start') {
        setStart(Math.min(newTime, end - 0.1));
      } else if (isDragging === 'end') {
        setEnd(Math.max(newTime, start + 0.1));
      }
    }
  }, [isDragging, duration, start, end]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  return (
    <Card className="w-full bg-white/5 backdrop-blur-sm border border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl text-white">{videoData?.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {videoURL ? (
          <>
            {/* Video Player */}
            <div className="relative">
              <video
                ref={videoRef}
                src={videoURL}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full rounded-lg border border-white/20 shadow-lg"
                style={{ maxHeight: "400px" }}
              />
               
              {/* Aspect Ratio Overlay */}
              {aspectRatio !== "16:9" && (
                <div
                  className="absolute border-2 border-white/50 bg-transparent pointer-events-none"
                  style={{
                    top: `${getAspectRatioOverlay().top}px`,
                    left: `${getAspectRatioOverlay().left}px`,
                    width: `${getAspectRatioOverlay().width}px`,
                    height: `${getAspectRatioOverlay().height}px`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                  }}
                />
              )}
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              <span className="text-white text-sm font-medium">Aspect Ratio:</span>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {aspectRatios.map((ratio) => (
                    <SelectItem 
                      key={ratio.value} 
                      value={ratio.value}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-gray-400 text-sm">Selected: {aspectRatio}</span>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center gap-2 py-1">
              <Button
                onClick={() => seekTo(start)}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button
                onClick={() => seekTo(end)}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Timeline Controls */}
            <div className="flex justify-center gap-3 py-1">
              <Dialog open={isSaveModalOpen} onOpenChange={(open) => {
                setIsSaveModalOpen(open);
                if (!open) resetSaveModal();
              }}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white px-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Video
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-purple-500/20 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white text-lg">Save Video</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {!showNameInput ? (
                      <div className="space-y-3">
                        <p className="text-gray-300 text-sm">How would you like to save the video?</p>
                        <div className="flex flex-col gap-2">
                          <Button 
                            onClick={() => handleSaveVideo(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              "Override Original Video"
                            )}
                          </Button>
                          <Button 
                            onClick={() => handleSaveVideo(false)}
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-800/50 bg-transparent"
                            disabled={isLoading}
                          >
                            Save as New Video
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-300 text-sm">Enter a name for the new video:</p>
                        <Input
                          placeholder="Enter video name"
                          value={saveAsNewName}
                          onChange={(e) => setSaveAsNewName(e.target.value)}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !isLoading) {
                              handleSaveVideo(false);
                            }
                          }}
                          disabled={isLoading}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleSaveVideo(false)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={!saveAsNewName.trim() || isLoading}
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>
                          <Button 
                            onClick={() => setShowNameInput(false)}
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-800/50 bg-transparent"
                            disabled={isLoading}
                          >
                            Back
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
               <Button 
              onClick={() => handleDownloadVideo(videoData?.url, videoData?.name)}                className="bg-purple-600 hover:bg-purple-700 text-white px-4"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-between bg-white/5 rounded-lg p-2">
              <div className="flex gap-2">
                <Button 
                  onClick={handleSetStart} 
                  variant="secondary" 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Set Start
                </Button>
                <Button 
                  onClick={handleSetEnd} 
                  variant="secondary" 
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Set End
                </Button>
              </div>
              
              <div className="text-sx text-gray-300">
                <span className="font-mono">
                  Start: {secondsToTimestamp(start)} | 
                  End: {secondsToTimestamp(end)} | 
                  Duration: {secondsToTimestamp(duration)}
                </span>
              </div>
            </div>

            {/* Draggable Timeline */}
            <div className="space-y-2">
              <div className="text-white text-sm font-medium">Timeline</div>
              <div 
                ref={timelineRef}
                className="relative h-16 bg-gray-800 rounded-lg cursor-pointer overflow-hidden"
                onClick={handleTimelineClick}
              >
                {/* Background timeline */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600"></div>
                
                {/* Selected range */}
                {duration > 0 && (
                  <div
                    className="absolute h-full bg-gradient-to-r from-blue-500/70 to-purple-500/70 border-2 border-blue-400"
                    style={{
                      left: `${(start / duration) * 100}%`,
                      width: `${((end - start) / duration) * 100}%`,
                    }}
                  />
                )}
                
                {/* Current time indicator */}
                {duration > 0 && (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-white shadow-lg z-10"
                    style={{
                      left: `${(currentTime / duration) * 100}%`,
                    }}
                  />
                )}
                
                {/* Start handle */}
                {duration > 0 && (
                  <div
                    className="absolute top-0 w-3 h-full bg-green-500 cursor-ew-resize hover:bg-green-400 transition-colors z-20"
                    style={{ left: `${(start / duration) * 100}%` }}
                    onMouseDown={() => handleMouseDown('start')}
                  />
                )}
                
                {/* End handle */}
                {duration > 0 && (
                  <div
                    className="absolute top-0 w-3 h-full bg-red-500 cursor-ew-resize hover:bg-red-400 transition-colors z-20"
                    style={{ left: `${(end / duration) * 100}%`, transform: 'translateX(-100%)' }}
                    onMouseDown={() => handleMouseDown('end')}
                  />
                )}
                
                {/* Time labels */}
                <div className="absolute bottom-1 left-2 text-xs text-white font-mono">
                  {secondsToTimestamp(0)}
                </div>
                <div className="absolute bottom-1 right-2 text-xs text-white font-mono">
                  {secondsToTimestamp(duration)}
                </div>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
              <Volume2 className="w-5 h-5 text-white" />
              <div className="flex-1">
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <span className="text-white text-sm font-mono w-10">{volume[0]}%</span>
            </div>
          {/* Manual Time Input */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-sm text-gray-300">Start Time (seconds)</label>
                <Input
                  type="number"
                  min={0}
                  max={end}
                  step={0.1}
                  value={start}
                 onChange={(e) => setStart(Math.max(0, Math.min(Number(e.target.value), end - 0.1)))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
               <div className="space-y-1">
                <label className="block text-sm text-gray-300">End Time (seconds)</label>
                <Input
                  type="number"
                  min={start}
                  max={duration}
                  step={0.1}
                  value={end}
                   onChange={(e) => setEnd(Math.max(start + 0.1, Math.min(Number(e.target.value), duration)))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center py-12">
            No video available to trim.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoTrimmer;

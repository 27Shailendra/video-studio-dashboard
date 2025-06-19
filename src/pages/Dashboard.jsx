import React, { useState, useEffect } from 'react';
import { Upload, Film, User, LogOut, Play, Calendar, HardDrive, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';
import { logoutUser, fetchVideos } from '../api/auth';

const Dashboard = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [editCount,setEditCount]=useState(0);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_VIDEO_API_URL;
  const userId = localStorage.getItem("userId");
  
  const fetchAndSetVideos = async () => {
  try {
    const res = await fetchVideos(userId);
    if (!res.ok) {
      throw new Error(`Failed to fetch videos: ${res.status}`);
    }
    const data = await res.json();
    setUploadedVideos(data?.videos);
    setEditCount(data?.editedCount);
  } catch (err) {
    console.error('Error fetching videos', err);
  }
};

useEffect(() => {
 if (userId || success == true) {
   fetchAndSetVideos();
 }
}, [userId,success]);

  const validateFile = (file) => {
    // Check file type - only MP4 allowed
    if (!file.type.startsWith('video/mp4')) {
      return 'Please select only MP4 video files';
    }
    
    // Check file size - max 100MB
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'File size must be less than 100MB';
    }
    
    return null;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    setSuccess(false);
    handleUpload(file);
  };

const handleUpload = async (file) => {
  if (!file) return;
  setUploading(true);
  setUploadProgress(0);
  setError('');

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

  // Validation
  const maxSizeMB = 100;
  if (file.type !== 'video/mp4') {
    setError('Only MP4 videos are allowed.');
    return;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    setError(`File size must be less than ${maxSizeMB}MB.`);
    return;
  }

  if (!userId) {
    setError('User not authenticated.');
    return;
  }
  setSuccess(false);

  try {
    const formData = new FormData();
    formData.append('video', file);             
    formData.append('userId', userId.toString());          

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${baseUrl}/api/videos/upload`);

  xhr.onload = () => {
  if (xhr.status === 201 || xhr.status === 200) {
    setUploadProgress(100);
    setSuccess(true);
    setUploading(false);
    
    setTimeout(() => {
      setSelectedFile(null);
      setUploadProgress(0);
      setSuccess(false);
    }, 2000);
  } else {
    try {
      const response = JSON.parse(xhr.responseText);
      setError(response?.error || 'Upload failed');
    } catch (e) {
    clearInterval(progressInterval);
      console.error('Non-JSON response from server:', xhr.responseText);
      setError('Upload failed. Server error or invalid response.');
    }
    setUploading(false);
    setUploadProgress(0);
  }
  };
    xhr.onload = () => {
      if (xhr.status === 201 || xhr.status === 200) {
        setUploadProgress(100);
        setSuccess(true);
        setUploading(false);

        // Reset UI after short delay
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
          setSuccess(false);
        }, 2000);
      } else {
        const response = JSON.parse(xhr.responseText);
        throw new Error(response?.error || 'Upload failed');
      }
    };

    xhr.onerror = () => {
      throw new Error('Network error during upload');
    };

    xhr.send(formData); 

  } catch (err) {
    console.error('Upload failed:', err);
    setError(err.message || 'Upload failed. Please try again.');
    setUploading(false);
    setUploadProgress(0);
  }
};

    const handlePlayVideo = (videoName) => {
      navigate(`/edit/${videoName}`);
    };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ', ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const logout = async () => {
  try {
    const response = await logoutUser();
    const data = await response;
    if (response.status) {
      localStorage.clear();
      navigate('/login');
    } else {
      console.error(data.error || 'Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VideoEdit Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
              <User className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300">Welcome back!</span>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              What would you like to do today?
            </h1>
            <p className="text-xl text-gray-300">
              Choose from our powerful video editing features to create amazing content
            </p>
          </div>

          <div className="mb-12 upload-video-section">
            {/* Upload Video Section */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Upload Video</h2>
              </div>
              
            {!uploading && !selectedFile ? (
                <div className="text-center">
                  <label 
                    htmlFor="video-upload" 
                    className="cursor-pointer block"
                  >
                    <div className="border-2 border-dashed border-white/30 rounded-xl p-8 hover:border-white/50 transition-colors">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Film className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Drop your video here</h3>
                      <p className="text-gray-400 mb-4">or click to browse files</p>
                      <button onChange={handleFileSelect} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
                        Select Video File
                      </button>
                      <p className="text-sm text-gray-500 mt-4">Supports MP4 files up to 100MB</p>
                    </div>
                  </label>
                  <input
                    id="video-upload"
                    type="file"
                    accept=".mp4,video/mp4"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : uploading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Film className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Uploading...</h3>
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-sm text-gray-300 mt-1">{Math.round(uploadProgress)}% complete</p>
                    </div>
                  </div>
                </div>
              ) : success ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Upload Complete!</h3>
                  <p className="text-gray-400">Your video has been uploaded successfully</p>
                </div>
              ) : null}

              {/* Error Message */}
              {error && (
                <div className="mt-6 flex items-center gap-3 text-red-400 bg-red-500/10 rounded-xl p-4">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}
            </div>

            {/* My Videos Section */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full">
              <div className="flex items-center gap-3 mb-6">
                <HardDrive className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">My Videos ({uploadedVideos.length})</h2>
              </div>
              
              {uploadedVideos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Film className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No videos uploaded</h3>
                  <p className="text-gray-400">Upload your first video to get started</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {uploadedVideos.map((video, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Film className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{video.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(video.uploadDate)}</span>
                            <span className="ml-4">{formatFileSize(video.size)}</span>
                          </div>
                        </div>
                      </div>
                     <button 
                        onClick={() => handlePlayVideo(video?.shortId)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      ><Play className="w-4 h-4" />
                        <span>Play</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">{uploadedVideos.length}</div>
                <div className="text-gray-400">Videos Uploaded</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2"></div>
                <div className="text-gray-400"></div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">{editCount}</div>
                <div className="text-gray-400">Videos Edited</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
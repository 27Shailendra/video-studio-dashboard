
import React, { useState } from 'react';
import { Upload as UploadIcon, Film, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateFile = (file) => {
    // Check file type - only MP4 allowed
    if (!file.type.startsWith('video/mp4')) {
      return 'Please select only MP4 video files';
    }
    
    // Check file size - max 100MB
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 100MB';
    }
    
    return null;
  };

   const saveVideoToStorage = async (video) => {
    try {
      const existingVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      const base64Data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(video);
      });

      const newVideo = {
        name: video.name,
        size: video.size,
        uploadDate: new Date().toISOString(),
        type: video.type,
        data: base64Data // Store the actual file data as base64
      };
      
      existingVideos.push(newVideo);
      localStorage.setItem('uploadedVideos', JSON.stringify(existingVideos));
      console.log('Video saved to localStorage.........:', newVideo.name);
    } catch (error) {
      console.error('Error saving video to storage:', error);
      throw error;
    }
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
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError('');

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;;
      });
    }, 150);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      // Save video to localStorage with file data
      await saveVideoToStorage(selectedFile);
      setSuccess(true);
      setUploading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setSelectedFile(null);
        setUploadProgress(0);
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      clearInterval(progressInterval);
      setError('Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VideoEdit Pro</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Upload Your Video</h1>
            <p className="text-xl text-gray-300">
              Upload MP4 files up to 100MB to start editing
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            {!selectedFile ? (
              <div className="text-center">
                <label 
                  htmlFor="video-upload" 
                  className="cursor-pointer block"
                >
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-12 hover:border-white/50 transition-colors">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <UploadIcon className="mt-4 w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Choose Video File</h3>
                        <p className="text-gray-400 mb-4">
                          or click to browse files
                        </p>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Select Video File
                        </button>
                        <div className="text-sm text-gray-500 mt-4">
                          <p>Supports MP4, MOV, AVI and other video formats</p>
                        </div>
                      </div>
                    </div>
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
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Film className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">{selectedFile.name}</h3>
                      <p className="text-gray-400">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    {success && (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {uploading && (
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
                )}

                {/* Success Message */}
                {success && (
                  <div className="flex items-center gap-3 text-green-400 bg-green-500/10 rounded-xl p-4">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">Video uploaded successfully! Redirecting to dashboard...</span>
                  </div>
                )}

                {/* Action Buttons */}
                 {!uploading && !success && (
                  <div className="flex gap-4">
                    <button
                      onClick={handleUpload}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    >
                      Upload Video
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setError('');
                        setSuccess(false);
                        setUploadProgress(0);
                      }}
                      className="px-6 py-3 border border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 flex items-center gap-3 text-red-400 bg-red-500/10 rounded-xl p-4">
                <AlertCircle className="w-6 h-6" />
                <span className="font-semibold">{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
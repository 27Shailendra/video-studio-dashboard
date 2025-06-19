
import { Link } from "react-router-dom";
import { Film, Play, Scissors, Upload, Download, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VideoEdit Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Edit Videos Like a
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Pro</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload, trim, and create stunning videos with our powerful yet simple video editor. 
            No experience required – just your creativity.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link 
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 text-lg"
            >
              <Play className="w-6 h-6" />
              Start Editing Free
            </Link>
            <Link 
              to="/login"
              className="px-8 py-4 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 text-lg"
            >
              Sign In
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Easy Upload</h3>
              <p className="text-gray-400">
                Drag and drop your videos or click to upload. Supports all major video formats.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Precise Trimming</h3>
              <p className="text-gray-400">
                Cut your videos to the exact length you need with frame-perfect precision.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">HD Export</h3>
              <p className="text-gray-400">
                Export your edited videos in high quality, ready to share anywhere.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-12 mt-16 text-center">
            <div>
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-gray-400">Videos Edited</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">5K+</div>
              <div className="text-gray-400">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">99%</div>
              <div className="text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

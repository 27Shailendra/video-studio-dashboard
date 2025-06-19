
import React from 'react';
import { Scissors, Film, Play } from 'lucide-react';

const FeaturesHighlight = () => {
  return (
    <div className="mt-8 flex justify-center gap-12 text-center">
  <div className="text-gray-400">
    <Scissors className="w-6 h-6 mx-auto mb-2" />
    <span className="text-xs">Trim & Cut</span>
  </div>
  <div className="text-gray-400">
    <Film className="w-6 h-6 mx-auto mb-2" />
    <span className="text-xs">HD Export</span>
  </div>
  <div className="text-gray-400">
    <Play className="w-6 h-6 mx-auto mb-2" />
    <span className="text-xs">Real-time Preview</span>
  </div>
</div>

  );
};

export default FeaturesHighlight;

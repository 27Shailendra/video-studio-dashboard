
import React from 'react';
import { Film } from 'lucide-react';

const LogoBrand = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4">
        <Film className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-400">{subtitle}</p>
    </div>
  );
};

export default LogoBrand;

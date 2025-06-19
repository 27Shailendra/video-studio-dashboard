
import React from 'react';
import BackgroundDecoration from '../components/BackgroundDecoration';
import LogoBrand from '../components/LogoBrand';
import SignupForm from '../components/SignupForm';
import FeaturesHighlight from '../components/FeaturesHighlight';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <BackgroundDecoration />

      <div className="relative w-full max-w-md mx-auto">
        <LogoBrand 
          title="VideoEdit Pro" 
          subtitle="Start your video editing journey" 
        />
        
        <SignupForm />
        
        {/* <FeaturesHighlight /> */}
      </div>
    </div>
  );
};

export default Signup;

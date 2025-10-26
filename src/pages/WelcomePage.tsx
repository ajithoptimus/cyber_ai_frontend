import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    "Threat Intelligence Analysis",
    "Real-time Security Monitoring", 
    "AI-Powered Risk Assessment",
    "GitHub Repository Scanning"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo & Title */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-16 h-16 text-teal-400" />
          </div>
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-white">Cyber</span>
            <span className="text-teal-400">.AI</span>
          </h1>
          <p className="text-xl text-gray-400">
            Executive Security Platform for Real-time Threat Intelligence
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4 mb-12 max-w-2xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-6 cursor-pointer transition-all hover:border-teal-500"
              onClick={() => navigate('/threat-intelligence')}
            >
              <p className="text-gray-300 text-center">{feature}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/threat-intelligence')}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg font-medium transition-colors text-lg"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-sm text-gray-500">
        <p>Powered by advanced AI and real-time threat intelligence</p>
      </div>
    </div>
  );
};

export default WelcomePage;

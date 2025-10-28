import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LOGO_URL = "/logo-cyber.ai.jpg";

const features = [
  "Threat Intelligence Analysis",
  "Real-time Security Monitoring",
  "AI-Powered Risk Assessment",
  "GitHub Repository Scanning"
];

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/threat-intelligence');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071018] via-[#202c41] to-[#151926] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <img
          src={LOGO_URL}
          alt="NexaSecure.ai Logo"
          className="w-36 sm:w-44 mb-8 drop-shadow-2xl"
          style={{ userSelect: 'none' }}
          draggable={false}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-1 text-center text-white">
          Nexa<span className="text-teal-400">Secure.ai</span>
        </h1>
        <p className="text-lg mb-10 text-gray-300 text-center max-w-xl font-normal">
          AI-driven threat intelligence & real-time security for next-gen teams.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 w-full max-w-xl">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-black/30 border border-gray-800 rounded-lg p-5 text-center font-medium text-gray-200 transition-all hover:shadow hover:border-teal-400"
            >
              {feature}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button
            onClick={() => navigate('/threat-intelligence')}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold text-lg shadow transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg shadow"
          >
            Sign In
          </button>
        </div>
      </div>
      <footer className="py-4 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} NexaSecure.ai — AI-powered security platform.
      </footer>
    </div>
  );
};

export default WelcomePage;

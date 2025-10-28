import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onReset: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onLogout }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  return (
    <header className="h-16 bg-[#192537] border-b border-gray-800 flex items-center justify-between px-6 shadow-sm z-20">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
        <img
          src="/logo-cyber.ai.jpg"
          alt="NexaSecure.ai logo"
          className="w-8 h-8 object-contain"
          style={{ userSelect: 'none' }}
          draggable={false}
        />
        <span className="text-xl font-bold text-white tracking-wide">NexaSecure.ai</span>
      </div>

      {/* Center: Service status/date */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-gray-400">System Online</span>
        </div>
        <span className="text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            month: 'short',
            day: 'numeric',
            year: 'numeric' 
          })}
        </span>
      </div>

      {/* Right: Auth buttons */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            {user?.email && (
              <div className="text-sm text-gray-300 mr-2">
                {user.username || user.email}
              </div>
            )}
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

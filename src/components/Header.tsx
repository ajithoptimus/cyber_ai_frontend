import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button onClick={onReset} className="cursor-pointer">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-blue-400">CYBER</span>
            <span className="text-white">.AI</span>
          </h1>
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">System Online</span>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-500">Executive Security Platform</div>
          <div className="text-sm text-white">
            {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

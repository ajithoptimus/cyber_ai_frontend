import React from 'react';
import { 
  Shield, 
  Search, 
  Globe, 
  Server, 
  MapPin, 
  AlertTriangle, 
  Database, 
  FileText,
  Activity,
  GitBranch  // NEW: Add GitBranch import
} from 'lucide-react';

interface SidebarProps {
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
  disabled?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFeature, onFeatureSelect, disabled = false }) => {
  const tools = [
    { id: 'threat-intelligence', name: 'Threat Intelligence', icon: Shield, color: 'text-blue-400' },
    { id: 'whois-lookup', name: 'WHOIS Lookup', icon: Globe, color: 'text-purple-400' },
    { id: 'dns-records', name: 'DNS Records', icon: Server, color: 'text-green-400' },
    { id: 'ip-lookup', name: 'IP Lookup', icon: MapPin, color: 'text-yellow-400' },
    { id: 'threat-check', name: 'Threat Check', icon: AlertTriangle, color: 'text-red-400' },
    { id: 'breach-check', name: 'Breach Check', icon: Database, color: 'text-orange-400' },
    { id: 'file-analysis', name: 'File Analysis', icon: FileText, color: 'text-cyan-400' },
    { id: 'github-integration', name: 'GitHub Security', icon: GitBranch, color: 'text-purple-500' }, // NEW: GitHub Integration
    { id: 'ai-reports', name: 'AI Reports', icon: Activity, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">ANALYSIS TOOLS</h2>
        {/* NEW: Show GitHub Integration status */}
        <div className="mb-2 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            DevSecOps Pipeline: Active
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeFeature === tool.id;
          
          // NEW: GitHub Integration is always available (not disabled by analysis requirement)
          const isGitHub = tool.id === 'github-integration';
          const isDisabled = disabled && !isGitHub;
          
          return (
            <button
              key={tool.id}
              onClick={() => !isDisabled && onFeatureSelect(tool.id)}
              disabled={isDisabled}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600/20 border border-blue-500/30 text-white'
                  : isDisabled
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-400' : tool.color}`} />
              <span className="font-medium">{tool.name}</span>
              {/* NEW: Show badge for GitHub Integration */}
              {isGitHub && (
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {disabled && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 text-center mb-3">
            Upload and analyze security data to access analysis tools
          </p>
          {/* NEW: Note about GitHub Integration */}
          <div className="text-xs text-purple-400 text-center border-t border-gray-600 pt-3">
            <GitBranch className="w-3 h-3 inline mr-1" />
            GitHub Security available anytime
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Sidebar;

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
  Activity
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
    { id: 'ai-reports', name: 'AI Reports', icon: Activity, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">ANALYSIS TOOLS</h2>
      </div>

      <nav className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeFeature === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => !disabled && onFeatureSelect(tool.id)}
              disabled={disabled}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600/20 border border-blue-500/30 text-white'
                  : disabled
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-400' : tool.color}`} />
              <span className="font-medium">{tool.name}</span>
            </button>
          );
        })}
      </nav>

      {disabled && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Upload and analyze security data to access analysis tools
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

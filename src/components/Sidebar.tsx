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
  GitBranch,
  Building2,
  Brain
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
    { id: 'github-integration', name: 'GitHub Security', icon: GitBranch, color: 'text-purple-500' },
    { id: 'infrastructure-analysis', name: 'Infrastructure Analysis', icon: Building2, color: 'text-emerald-400' },
    { id: 'smart-risk-analysis', name: 'AI Risk Intelligence', icon: Brain, color: 'text-purple-400' },
    { id: 'ai-performance', name: 'AI Performance', icon: Brain, color: 'text-pink-400' }, // Added AI Performance
    { id: 'ai-reports', name: 'AI Reports', icon: Activity, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">ANALYSIS TOOLS</h2>
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            DevSecOps Pipeline: Active
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
            IaC & IAM Scanners: Online
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
            AI Risk Analysis: Active
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeFeature === tool.id;
          const isAlwaysAvailable = ['github-integration', 'infrastructure-analysis', 'smart-risk-analysis', 'ai-performance'].includes(tool.id);

          const isDisabled = disabled && !isAlwaysAvailable;

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

              {/* Status badges for always-available features */}
              {tool.id === 'github-integration' && (
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                  LIVE
                </span>
              )}
              {tool.id === 'infrastructure-analysis' && (
                <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                  6 SCANNERS
                </span>
              )}
              {tool.id === 'smart-risk-analysis' && (
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                  AI POWERED
                </span>
              )}
              {tool.id === 'ai-performance' && (
                <span className="ml-auto text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full">
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
          <div className="text-xs text-gray-400 text-center border-t border-gray-600 pt-3 space-y-1">
            <div className="flex items-center justify-center">
              <GitBranch className="w-3 h-3 mr-1 text-purple-400" />
              <span className="text-purple-400">GitHub Security</span>
            </div>
            <div className="flex items-center justify-center">
              <Building2 className="w-3 h-3 mr-1 text-emerald-400" />
              <span className="text-emerald-400">Infrastructure Analysis</span>
            </div>
            <div className="flex items-center justify-center">
              <Brain className="w-3 h-3 mr-1 text-purple-400" />
              <span className="text-purple-400">AI Risk Intelligence</span>
            </div>
            <div className="flex items-center justify-center">
              <Brain className="w-3 h-3 mr-1 text-pink-400" />
              <span className="text-pink-400">AI Performance</span>
            </div>
            <div className="text-gray-500">available anytime</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

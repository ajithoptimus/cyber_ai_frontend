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
  Brain,
  Zap,
  Target,
  Link,
  TrendingUp
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
    { id: 'ai-detection', name: 'AI Detection', icon: Target, color: 'text-purple-500' },
    { id: 'siem-integration', name: 'SIEM Integration', icon: Link, color: 'text-blue-500' },
    { id: 'predictive-analytics', name: 'Predictive Analytics', icon: TrendingUp, color: 'text-green-500' },
    { id: 'threat-intel-live', name: 'Live Threats', icon: Zap, color: 'text-red-500' },
    { id: 'ai-performance', name: 'AI Performance', icon: Brain, color: 'text-pink-400' },
    { id: 'ai-reports', name: 'AI Reports', icon: Activity, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto">
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
          const isAlwaysAvailable = [
            'github-integration', 
            'infrastructure-analysis', 
            'smart-risk-analysis', 
            'ai-performance',
            'threat-intel-live',
            'ai-detection',
            'siem-integration',
            'predictive-analytics'
          ].includes(tool.id);

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
              <span className="font-medium text-sm">{tool.name}</span>

              {/* Status badges */}
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
                  AI
                </span>
              )}
              {tool.id === 'ai-detection' && (
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                  6A
                </span>
              )}
              {tool.id === 'siem-integration' && (
                <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                  6B
                </span>
              )}
              {tool.id === 'predictive-analytics' && (
                <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  6C
                </span>
              )}
              {tool.id === 'threat-intel-live' && (
                <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full animate-pulse">
                  6D
                </span>
              )}
              {tool.id === 'ai-performance' && (
                <span className="ml-auto text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full">
                  6E
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {disabled && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 text-center mb-3">
            Phase 6 Features Available Anytime
          </p>
          <div className="text-xs text-gray-500 text-center space-y-1">
            <div>🎯 AI Detection • 🔗 SIEM • 🔮 Predictive</div>
            <div>⚡ Live Threats • 📊 Performance</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

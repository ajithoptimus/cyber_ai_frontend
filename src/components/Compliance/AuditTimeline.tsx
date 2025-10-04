import React from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AuditStatistics {
  total_events: number;
  by_category: Record<string, number>;
  by_severity: Record<string, number>;
  failed_authentication_attempts: number;
}

interface Props {
  statistics?: AuditStatistics;
}

const AuditTimeline: React.FC<Props> = ({ statistics }) => {
  const events = [
    {
      type: 'authentication',
      action: 'User login successful',
      user: 'admin@cyber.ai',
      time: '2 minutes ago',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      type: 'data_access',
      action: 'Sensitive file accessed',
      user: 'security@cyber.ai',
      time: '15 minutes ago',
      icon: <Lock className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      type: 'security_event',
      action: 'Failed login attempt detected',
      user: 'unknown',
      time: '1 hour ago',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-red-400'
    },
    {
      type: 'configuration',
      action: 'Security policy updated',
      user: 'admin@cyber.ai',
      time: '3 hours ago',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-purple-400'
    },
    {
      type: 'compliance',
      action: 'Compliance audit completed',
      user: 'system',
      time: '6 hours ago',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div>
      {/* Statistics Summary */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Total Events</p>
            <p className="text-2xl font-bold text-white">{statistics.total_events}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Critical</p>
            <p className="text-2xl font-bold text-red-400">{statistics.by_severity.critical || 0}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Warnings</p>
            <p className="text-2xl font-bold text-yellow-400">{statistics.by_severity.warning || 0}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Failed Auth</p>
            <p className="text-2xl font-bold text-orange-400">{statistics.failed_authentication_attempts}</p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
            <div className={`flex-shrink-0 ${event.color}`}>
              {event.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{event.action}</p>
              <p className="text-xs text-gray-400 mt-1">by {event.user}</p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditTimeline;

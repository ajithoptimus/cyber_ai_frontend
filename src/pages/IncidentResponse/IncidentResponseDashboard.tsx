import React, { useState, useEffect } from 'react';
import { Activity, Plus } from 'lucide-react';
import IncidentListTable from '../../components/IncidentResponse/IncidentListTable';
import CreateIncidentModal from '../../components/IncidentResponse/CreateIncidentModal';
import IncidentDetailsModal from '../../components/IncidentResponse/IncidentDetailsModal';
import MetricsCards from '../../components/IncidentResponse/MetricsCards';
import PlaybookCard from '../../components/IncidentResponse/PlaybookCard';

interface Incident {
  id: number;
  incident_id: string;
  title: string;
  severity: string;
  status: string;
  incident_type: string;
  detected_at: string;
  affected_systems: string[];
  mttd: number | null;
  mttr: number | null;
  playbook: string | null;
}

interface Playbook {
  id: number;
  name: string;
  description: string;
  incident_type: string;
  auto_execute: boolean;
  requires_approval: boolean;
  execution_count: number;
  success_rate: number;
  steps_count: number;
}

interface Metrics {
  total_incidents: number;
  open_incidents: number;
  resolved_incidents: number;
  by_severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  response_metrics: {
    avg_mttd_minutes: number;
    avg_mttr_minutes: number;
    automation_rate: number;
    success_rate: number;
  };
}

const IncidentResponseDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchIncidents(),
        fetchPlaybooks(),
        fetchMetrics()
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    const response = await fetch('http://localhost:8000/incident-response/incidents');
    const data = await response.json();
    setIncidents(data.incidents || []);
  };

  const fetchPlaybooks = async () => {
    const response = await fetch('http://localhost:8000/incident-response/playbooks');
    const data = await response.json();
    setPlaybooks(data.playbooks || []);
  };

  const fetchMetrics = async () => {
    const response = await fetch('http://localhost:8000/incident-response/metrics/dashboard?days=30');
    const data = await response.json();
    setMetrics(data);
  };

  const handleCreateIncident = () => {
    setShowCreateModal(false);
    fetchAllData();
  };

  const filteredIncidents = filterStatus === 'all' 
    ? incidents 
    : incidents.filter(inc => inc.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Activity className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Incident Response & SOAR
            </h1>
            <p className="text-gray-400 text-xs">
              Automated incident response and security orchestration
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAllData}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2 transition-colors text-sm"
            >
              <Activity className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Incident</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <span className="text-sm text-gray-400 font-medium">Filter:</span>
          {['all', 'open', 'investigating', 'contained', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto space-y-4 pr-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.flex-1.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>

        {metrics && <MetricsCards metrics={metrics} />}

        <div>
          <h2 className="text-xl font-bold mb-4">Active Playbooks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {playbooks.map((playbook) => (
              <PlaybookCard key={playbook.id} playbook={playbook} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            Recent Incidents ({filteredIncidents.length})
          </h2>
          <IncidentListTable 
            incidents={filteredIncidents}
            onSelectIncident={setSelectedIncident}
          />
        </div>
      </div>

      <CreateIncidentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateIncident}
      />
      
      {selectedIncident && (
        <IncidentDetailsModal
          incidentId={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdate={fetchAllData}
        />
      )}
    </div>
  );
};

export default IncidentResponseDashboard;

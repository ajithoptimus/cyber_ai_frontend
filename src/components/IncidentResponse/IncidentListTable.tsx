import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Incident {
  id: number;
  incident_id: string;
  title: string;
  severity: string;
  status: string;
}

interface Props {
  incidents: Incident[];
  onSelectIncident: (id: number) => void;
}

const IncidentListTable: React.FC<Props> = ({ incidents, onSelectIncident }) => {
  if (incidents.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
        <p className="text-gray-400">No incidents found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <p className="text-gray-300">Incident List Table - {incidents.length} incidents</p>
    </div>
  );
};

export default IncidentListTable;

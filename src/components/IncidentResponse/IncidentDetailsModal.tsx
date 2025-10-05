import React from 'react';

interface Props {
  incidentId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const IncidentDetailsModal: React.FC<Props> = ({ incidentId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="text-white">Incident Details: {incidentId}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default IncidentDetailsModal;

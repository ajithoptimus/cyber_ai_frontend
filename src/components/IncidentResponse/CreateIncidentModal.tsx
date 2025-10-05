import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateIncidentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="text-white">Create Incident Modal</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateIncidentModal;

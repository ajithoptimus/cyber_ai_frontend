import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';

interface Policy {
  id: number;
  policy_id: string;
  title: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ViolationReportModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [formData, setFormData] = useState({
    policy_id: '',
    description: '',
    severity: 'medium',
    detected_by: '',
    affected_system: '',
    affected_user: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchPolicies();
    }
  }, [isOpen]);

  const fetchPolicies = async () => {
    try {
      const response = await fetch('http://localhost:8000/compliance/policies?status=active');
      if (response.ok) {
        const data = await response.json();
        setPolicies(data.policies || []);
      }
    } catch (err) {
      console.error('Failed to fetch policies:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/compliance/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to report violation');

      onSuccess();
      onClose();
      setFormData({
        policy_id: '',
        description: '',
        severity: 'medium',
        detected_by: '',
        affected_system: '',
        affected_user: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to report violation');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Policy Violation</h2>
              <p className="text-sm text-gray-400">Document a security policy breach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Policy Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Violated Policy <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.policy_id}
              onChange={(e) => setFormData({ ...formData, policy_id: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">Select policy</option>
              {policies.map((policy) => (
                <option key={policy.id} value={policy.id}>
                  {policy.policy_id} - {policy.title}
                </option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Severity <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'low', label: 'Low', color: 'blue' },
                { value: 'medium', label: 'Medium', color: 'yellow' },
                { value: 'high', label: 'High', color: 'orange' },
                { value: 'critical', label: 'Critical', color: 'red' }
              ].map((severity) => (
                <button
                  key={severity.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: severity.value })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.severity === severity.value
                      ? `bg-${severity.color}-500/20 border-${severity.color}-500 text-${severity.color}-400`
                      : 'bg-gray-900 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {severity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Violation Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe what policy was violated and how..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          {/* Detected By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Detected By <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Security Team, AI System, User Report"
              value={formData.detected_by}
              onChange={(e) => setFormData({ ...formData, detected_by: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Affected System & User */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Affected System
              </label>
              <input
                type="text"
                placeholder="e.g., Web Server, Database"
                value={formData.affected_system}
                onChange={(e) => setFormData({ ...formData, affected_system: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Affected User
              </label>
              <input
                type="text"
                placeholder="e.g., john.doe@company.com"
                value={formData.affected_user}
                onChange={(e) => setFormData({ ...formData, affected_user: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Reporting...' : 'Report Violation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViolationReportModal;

import React, { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  frameworkId?: number;
  onSuccess: () => void;
}

const AddControlModal: React.FC<Props> = ({ isOpen, onClose, frameworkId, onSuccess }) => {
  const [formData, setFormData] = useState({
    framework_id: frameworkId || 1,
    control_id: '',
    title: '',
    category: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Access Control',
    'Asset Management',
    'Cryptography',
    'Physical Security',
    'Operations Security',
    'Communications Security',
    'System Acquisition',
    'Supplier Relationships',
    'Incident Management',
    'Business Continuity',
    'Compliance'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/compliance/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add control');

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        framework_id: frameworkId || 1,
        control_id: '',
        title: '',
        category: '',
        description: '',
        priority: 'medium'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add control');
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
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Compliance Control</h2>
              <p className="text-sm text-gray-400">Define a new control requirement</p>
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

          {/* Control ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Control ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., AC-1, PR.AC-1, A.9.1.1"
              value={formData.control_id}
              onChange={(e) => setFormData({ ...formData, control_id: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Control Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Access Control Policy"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <div className="flex space-x-4">
              {['low', 'medium', 'high', 'critical'].map((priority) => (
                <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 capitalize">{priority}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of the control requirement..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
            />
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Adding...' : 'Add Control'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddControlModal;

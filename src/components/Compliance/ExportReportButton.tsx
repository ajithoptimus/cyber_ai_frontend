import React, { useState } from 'react';
import { Download, FileText, File } from 'lucide-react';

interface Props {
  frameworkId?: number;
}

const ExportReportButton: React.FC<Props> = ({ frameworkId }) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const exportToJSON = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/compliance/dashboard/summary');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export report');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const exportToCSV = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/compliance/dashboard/summary');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      
      // Convert frameworks to CSV
      const csvRows = [
        ['Framework', 'Version', 'Compliance Score', 'Implemented Controls', 'Total Controls', 'Status'],
        ...data.frameworks.map((f: any) => [
          f.name,
          f.version,
          f.compliance_score,
          f.implemented_controls,
          f.total_controls,
          f.status
        ])
      ];
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export report');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const exportToPDF = () => {
    alert('PDF export coming soon! Use Print (Ctrl+P) for now.');
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        <span>{loading ? 'Exporting...' : 'Export Report'}</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
          <button
            onClick={exportToJSON}
            className="w-full px-4 py-3 hover:bg-gray-700 flex items-center space-x-3 text-left transition-colors"
          >
            <File className="w-4 h-4 text-blue-400" />
            <span className="text-white">Export as JSON</span>
          </button>
          <button
            onClick={exportToCSV}
            className="w-full px-4 py-3 hover:bg-gray-700 flex items-center space-x-3 text-left transition-colors border-t border-gray-700"
          >
            <FileText className="w-4 h-4 text-green-400" />
            <span className="text-white">Export as CSV</span>
          </button>
          <button
            onClick={exportToPDF}
            className="w-full px-4 py-3 hover:bg-gray-700 flex items-center space-x-3 text-left transition-colors border-t border-gray-700"
          >
            <FileText className="w-4 h-4 text-red-400" />
            <span className="text-white">Export as PDF</span>
          </button>
        </div>
      )}

      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ExportReportButton;

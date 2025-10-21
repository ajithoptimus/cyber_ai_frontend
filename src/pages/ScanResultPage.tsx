import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import ScanResultsDisplay from '../components/ScanResultsDisplay';

const ScanResultPage: React.FC = () => {
  const { scan_id } = useParams<{ scan_id: string }>();
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    const fetchScan = () => {
      apiClient.get(`/scanner/scans/${scan_id}`)
        .then(res => {
          setScan(res.data);
          setLoading(false);
          if (res.data.status !== 'COMPLETED' && res.data.status !== 'FAILED') {
            pollInterval = setTimeout(fetchScan, 5000);
          }
        })
        .catch(() => {
          setLoading(false);
          navigate('/dashboard');
        });
    };
    fetchScan();
    return () => clearTimeout(pollInterval);
  }, [scan_id, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading analysis...</div>;
  }
  if (!scan || !scan.ai_analysis) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400">Scan not found or no analysis available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Scan Results for {scan.repository}</h1>
      <p className="mb-6 text-gray-400">
        Status: <span className={scan.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}>{scan.status}</span>
      </p>
      <ScanResultsDisplay analysis={scan.ai_analysis} />
      <div className="mt-6">
        <button
          className="bg-blue-600 px-4 py-2 rounded text-white font-bold"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ScanResultPage;

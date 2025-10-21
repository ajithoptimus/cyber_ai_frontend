import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';

interface ScanItem {
  id: string;
  repository: string;
  status: string;
  ai_risk_score: number | null;
}

const dummyRepos = [
  { name: 'my-org/cyber-ai-backend', url: 'https://github.com/my-org/cyber-ai-backend' },
  { name: 'my-org/cyber-ai-frontend', url: 'https://github.com/my-org/cyber-ai-frontend' }
];

const DashboardPage: React.FC = () => {
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiClient.get('/scanner/scans/')
      .then(res => setScans(res.data))
      .catch(() => setScans([]))
      .finally(() => setLoading(false));
  }, []);

  const handleScan = (repoUrl: string) => {
    apiClient.post('/scanner/scan', { repo_url: repoUrl })
      .then(() => {
        alert('Scan triggered!');
      })
      .catch(() => alert('Failed to trigger scan!'));
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Repository Scanner Dashboard</h1>
        <button className="bg-red-700 px-4 py-2 rounded text-white font-bold" onClick={handleLogout}>Logout</button>
      </div>
      <div className="mb-10">
        <h2 className="text-xl text-white font-semibold mb-4">Your GitHub Repositories</h2>
        <div className="space-y-4">
          {dummyRepos.map(repo => (
            <div key={repo.url} className="bg-gray-800 rounded p-4 flex justify-between items-center">
              <span className="text-white">{repo.name}</span>
              <button
                className="bg-blue-600 px-4 py-2 rounded text-white font-bold"
                onClick={() => handleScan(repo.url)}
              >
                Scan Now
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl text-white font-semibold mb-4">Scan History</h2>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <table className="w-full bg-gray-800 rounded">
            <thead>
              <tr className="text-white border-b border-gray-700">
                <th className="py-2 px-4 text-left">Repository</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">AI Risk Score</th>
                <th className="py-2 px-4 text-left">Results</th>
              </tr>
            </thead>
            <tbody>
              {scans.map(scan => (
                <tr key={scan.id} className="text-gray-300 hover:bg-gray-700">
                  <td className="py-2 px-4">{scan.repository}</td>
                  <td className="py-2 px-4">{scan.status}</td>
                  <td className="py-2 px-4">{scan.ai_risk_score !== null ? scan.ai_risk_score : '-'}</td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-400 underline"
                      onClick={() => navigate(`/scans/${scan.id}`)}
                    >
                      View Results
                    </button>
                  </td>
                </tr>
              ))}
              {scans.length === 0 && (<tr><td colSpan={4} className="py-4 text-center text-gray-400">No scans yet.</td></tr>)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

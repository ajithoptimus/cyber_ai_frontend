import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import ReactMarkdown from 'react-markdown';

const AI_TABS = [
  { key: 'ai_sast_results', label: 'App Vulnerabilities' },
  { key: 'ai_malware_results', label: 'Malware/Ransomware' },
  { key: 'ai_iac_results', label: 'Cloud/IaC Security' },
  { key: 'ai_dependency_results', label: 'Supply Chain/Dependencies' },
  { key: 'ai_secrets_results', label: 'Secrets' },
];

const ScanResultPage: React.FC = () => {
  const { scan_id } = useParams<{ scan_id: string }>();
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(AI_TABS[0].key);
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
  if (!scan) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400">Scan not found or no analysis available.</div>;
  }

  /** Helper to render each AI section (table, card, etc. as needed) */
  const renderTabPanel = (key: string) => {
    const domain = scan[key];
    if (!domain || Object.keys(domain).length === 0) {
      return <div className="text-gray-400 py-8">No findings from this expert.</div>;
    }
    if (Array.isArray(domain)) {
      return (
        <ul className="list-disc list-inside space-y-2">
          {domain.map((item: any, i: number) => (
            <li key={i}>
              <span className="font-semibold">{item.rule_id || item.secret_type || item.finding}</span>
              {item.line !== undefined && <span className="ml-2 text-xs text-gray-400">[line {item.line}]</span>}
              <span className="ml-2">{item.message || item.explanation || item.reasoning || item.value || item.recommendation}</span>
            </li>
          ))}
        </ul>
      );
    }
    // Object - probably {filename: findings}
    return Object.entries(domain).map(([fname, fileResult]: [string, any]) => (
      <div key={fname} className="mb-4">
        <h4 className="text-blue-300 font-semibold mb-2">{fname}</h4>
        <pre className="bg-gray-800 px-3 py-2 rounded text-gray-200">
          {JSON.stringify(fileResult, null, 2)}
        </pre>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Scan Results for {scan.repository}</h1>
      <p className="mb-4 text-gray-400">
        Status:{' '}
        <span className={scan.status === 'COMPLETED' ? 'text-green-400' : scan.status === 'FAILED' ? 'text-red-400' : 'text-yellow-400'}>
          {scan.status}
        </span>
      </p>
      <div className="mb-8 flex space-x-2 border-b border-gray-700">
        {AI_TABS.map(tab => (
          <button
            key={tab.key}
            className={`py-2 px-4 text-sm font-bold border-b-2 ${
              activeTab === tab.key
                ? 'border-blue-400 text-blue-300'
                : 'border-transparent text-gray-400 hover:text-blue-200'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-gray-800 rounded-lg p-6 mb-10 border border-gray-700 min-h-[180px]">
        {renderTabPanel(activeTab)}
      </div>
      {/* Executive/Markdown Report */}
      {scan.final_ai_report && (
        <div className="mt-10 bg-gray-800 p-6 rounded border border-blue-800 shadow-lg">
          <h2 className="text-xl font-bold text-blue-300 mb-4">AI CISO Executive Report</h2>
          <ReactMarkdown className="prose prose-invert prose-gray max-w-none">{scan.final_ai_report}</ReactMarkdown>
        </div>
      )}
      <div className="mt-8">
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

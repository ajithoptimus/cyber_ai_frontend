import React, { useState, useEffect } from 'react';

const InfrastructureAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [findings, setFindings] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const mockSummary = {
    total_findings: 12,
    iac_findings: 8,
    iam_findings: 4,
    critical: 2,
    high: 3,
    medium: 4,
    low: 2,
    info: 1
  };

  const mockFindings = [
    {
      id: 1,
      type: 'IaC',
      severity: 'HIGH',
      title: 'Unencrypted S3 Bucket',
      description: 'S3 bucket does not have server-side encryption enabled',
      file: 'terraform/s3.tf',
      line: 15,
      remediation: 'Enable server-side encryption with AES-256 or KMS'
    },
    {
      id: 2,
      type: 'IAM',
      severity: 'CRITICAL',
      title: 'Overprivileged IAM Role',
      description: 'IAM role has wildcard permissions (*:*) attached',
      file: 'iam/roles.json',
      line: 23,
      remediation: 'Apply principle of least privilege, remove wildcard permissions'
    }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: 'bg-red-500 text-white',
      HIGH: 'bg-orange-500 text-white',
      MEDIUM: 'bg-yellow-500 text-black',
      LOW: 'bg-blue-500 text-white',
      INFO: 'bg-gray-500 text-white'
    };
    return colors[severity] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading infrastructure analysis...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-emerald-400 rounded flex items-center justify-center">
          <span className="text-gray-900 font-bold">🏗️</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Infrastructure Security Analysis</h1>
          <p className="text-gray-400">IaC and IAM security findings from your repositories</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Findings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Infrastructure Findings</p>
              <p className="text-3xl font-bold text-white">{mockSummary.total_findings}</p>
            </div>
            <div className="w-8 h-8 bg-emerald-400 rounded flex items-center justify-center">
              <span className="text-gray-900 font-bold">🛡️</span>
            </div>
          </div>
        </div>
        
        {/* Category Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-3">Category Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white">IaC Issues:</span>
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                {mockSummary.iac_findings}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">IAM Issues:</span>
              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-sm">
                {mockSummary.iam_findings}
              </span>
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-3">Severity Distribution</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-white">Critical:</span>
              <span className="px-2 py-1 rounded text-xs bg-red-500 text-white">
                {mockSummary.critical}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">High:</span>
              <span className="px-2 py-1 rounded text-xs bg-orange-500 text-white">
                {mockSummary.high}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Medium:</span>
              <span className="px-2 py-1 rounded text-xs bg-yellow-500 text-black">
                {mockSummary.medium}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Low:</span>
              <span className="px-2 py-1 rounded text-xs bg-blue-500 text-white">
                {mockSummary.low}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'All Findings' },
          { key: 'iac', label: 'Infrastructure as Code' },
          { key: 'iam', label: 'Identity & Access Management' }
        ].map(category => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === category.key
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Infrastructure Security Findings</h3>
          <p className="text-gray-400 text-sm">Detailed analysis from IaC and IAM scanners</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {mockFindings.map(finding => (
              <div key={finding.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(finding.severity)}`}>
                      {finding.severity}
                    </span>
                    <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                      {finding.type}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">cyber_ai_backend</span>
                </div>
                
                <h4 className="font-semibold text-white mb-2">{finding.title}</h4>
                <p className="text-gray-300 mb-3">{finding.description}</p>
                
                <div className="text-sm text-gray-400 mb-3">
                  <span className="font-medium">File:</span> {finding.file} (Line {finding.line})
                </div>
                
                <div className="bg-blue-900/30 border border-blue-500/30 rounded p-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400">🛡️</span>
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Remediation</p>
                      <p className="text-blue-200 text-sm">{finding.remediation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureAnalysis;

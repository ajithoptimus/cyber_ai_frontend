import React, { useState } from 'react';

interface FileResult {
  filename: string;
  file_type: string;
  findings_count: number;
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface Props {
  fileResults: FileResult[];
  findings: any[];
  onFileSelect: (filename: string | null) => void;
}

const FileResultsCard: React.FC<Props> = ({ fileResults, findings, onFileSelect }) => {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  const toggleFile = (filename: string) => {
    if (expandedFile === filename) {
      setExpandedFile(null);
      onFileSelect(null);
    } else {
      setExpandedFile(filename);
      onFileSelect(filename);
    }
  };

  const getFileIcon = (fileType: string) => {
    const icons = {
      terraform: '🔧',
      cloudformation: '☁️',
      kubernetes: '⎈',
      iam_policy: '🔐',
      yaml: '📄',
      json: '📋'
    };
    return icons[fileType] || '📄';
  };

  const getHealthColor = (findingsCount: number) => {
    if (findingsCount === 0) return 'bg-green-500';
    if (findingsCount <= 2) return 'bg-yellow-500';
    if (findingsCount <= 5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      CRITICAL: 'bg-red-500 text-white',
      HIGH: 'bg-orange-500 text-white',
      MEDIUM: 'bg-yellow-500 text-black',
      LOW: 'bg-blue-500 text-white',
      INFO: 'bg-gray-500 text-white'
    };
    return colors[severity] || 'bg-gray-500 text-white';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xl">📊</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Batch Scan Results</h3>
            <p className="text-gray-400 text-sm">
              {fileResults.length} files analyzed | Click to expand details
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {fileResults.map((fileResult, index) => {
          const fileFindings = findings.filter(f => f.file === fileResult.filename);
          const isExpanded = expandedFile === fileResult.filename;

          return (
            <div 
              key={index}
              className="border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors"
            >
              {/* File Header - Clickable */}
              <button
                onClick={() => toggleFile(fileResult.filename)}
                className="w-full px-4 py-3 bg-gray-750 hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {/* Health Indicator Dot */}
                  <div className={`w-3 h-3 rounded-full ${getHealthColor(fileResult.findings_count)}`}></div>
                  
                  {/* File Icon & Name */}
                  <span className="text-2xl">{getFileIcon(fileResult.file_type)}</span>
                  <div className="text-left">
                    <p className="text-white font-medium">{fileResult.filename}</p>
                    <p className="text-gray-400 text-xs">{fileResult.file_type}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Findings Count */}
                  <div className="flex items-center space-x-2">
                    {fileResult.summary.critical > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-red-500 text-white">
                        {fileResult.summary.critical} CRITICAL
                      </span>
                    )}
                    {fileResult.summary.high > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-orange-500 text-white">
                        {fileResult.summary.high} HIGH
                      </span>
                    )}
                    {fileResult.summary.medium > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500 text-black">
                        {fileResult.summary.medium} MEDIUM
                      </span>
                    )}
                    {fileResult.findings_count === 0 && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-green-500 text-white">
                        ✓ SECURE
                      </span>
                    )}
                  </div>

                  {/* Expand Arrow */}
                  <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {/* Expanded Content - File Findings */}
              {isExpanded && (
                <div className="p-4 bg-gray-800 border-t border-gray-700">
                  {fileFindings.length > 0 ? (
                    <div className="space-y-3">
                      {fileFindings.map((finding, idx) => (
                        <div key={idx} className="border border-gray-600 rounded-lg p-4 bg-gray-750">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(finding.severity)}`}>
                                {finding.severity}
                              </span>
                              <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs font-medium">
                                {finding.type}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">Line {finding.line}</span>
                          </div>
                          
                          <h4 className="font-semibold text-white mb-2">{finding.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">{finding.description}</p>
                          
                          <div className="bg-gray-900 p-2 rounded mb-2">
                            <code className="text-xs text-gray-400">{finding.code_snippet}</code>
                          </div>
                          
                          <div className="bg-blue-900/30 border border-blue-500/30 rounded p-3">
                            <p className="text-blue-300 text-xs font-semibold mb-1">🛡️ Remediation</p>
                            <p className="text-blue-200 text-xs">{finding.remediation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <span className="text-green-400 text-2xl">✓</span>
                      <p className="text-gray-400 text-sm mt-2">No security issues found in this file</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileResultsCard;

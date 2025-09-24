import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Eye, Globe, Mail, Wifi } from 'lucide-react';

interface FileUploadProps {
  onAnalysisComplete?: (results: any) => void;
}

interface AnalysisResult {
  status: string;
  analysis_results?: any;
  analysis_summary?: any;
  osint_results?: any;
  data_preview?: any;
  summary?: any;
  risk_assessment?: any;
  file_info?: any;
  recommendations?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResults(null);

    try {
      console.log('📁 Uploading file:', file.name);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/v1/dashboard/frontend/upload/analyze', {
        method: 'POST',
        body: formData
      });

      console.log('📁 Upload response status:', response.status);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📁 Upload response data:', data);

      setResults(data);
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }

    } catch (error) {
      console.error('📁 Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">File Analysis Report</h1>
        <p className="text-gray-400">Advanced OSINT and security analysis capabilities</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2 text-blue-400" />
          File Analysis
          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">LIVE</span>
        </h3>

        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Upload JSON, text, or code files for comprehensive security analysis</p>
          <p className="text-gray-500 text-sm mb-4">Advanced OSINT • Entity Extraction • Breach Checking • Data Redaction</p>
          
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
            accept=".json,.txt,.js,.py,.md,.yml,.yaml,.csv,.xml"
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-6 py-3 rounded-lg cursor-pointer transition-colors ${
              uploading 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Analyzing...' : 'Select File for Analysis'}
          </label>
        </div>

        {uploading && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-3"></div>
              <span className="text-blue-400">Running comprehensive security analysis...</span>
            </div>
            <div className="text-blue-300 text-sm space-y-1 ml-7">
              <p>• Extracting entities (emails, IPs, domains)</p>
              <p>• Checking for secrets and vulnerabilities</p>
              <p>• Running OSINT breach analysis</p>
              <p>• Applying data redaction for privacy</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {results && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Analysis Complete</span>
              {results.file_info && (
                <span className="ml-4 text-gray-400 text-sm">
                  {results.file_info.filename} ({(results.file_info.size_bytes / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>

            {/* ENHANCED: OSINT Analysis Summary */}
            {results.analysis_summary && (
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-blue-400" />
                  Analysis Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 text-sm flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      Emails Found
                    </div>
                    <div className="text-white text-xl font-bold">{results.analysis_summary.emails_found || 0}</div>
                  </div>
                  <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/20">
                    <div className="text-green-400 text-sm flex items-center">
                      <Wifi className="w-3 h-3 mr-1" />
                      IPs Found
                    </div>
                    <div className="text-white text-xl font-bold">{results.analysis_summary.ips_found || 0}</div>
                  </div>
                  <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
                    <div className="text-purple-400 text-sm flex items-center">
                      <Globe className="w-3 h-3 mr-1" />
                      Domains Found
                    </div>
                    <div className="text-white text-xl font-bold">{results.analysis_summary.domains_found || 0}</div>
                  </div>
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                    <div className="text-red-400 text-sm">Breached Emails</div>
                    <div className="text-white text-xl font-bold">{results.analysis_summary.breached_emails || 0}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Findings */}
            {(results.summary || results.analysis_summary) && (
              <div>
                <h4 className="text-white font-semibold mb-3">Security Findings</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 text-sm">Total Findings</div>
                    <div className="text-white text-xl font-bold">
                      {results.summary?.total_findings || results.analysis_summary?.total_findings || 0}
                    </div>
                  </div>
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                    <div className="text-red-400 text-sm">Critical</div>
                    <div className="text-white text-xl font-bold">
                      {results.summary?.critical_findings || results.analysis_summary?.critical_findings || 0}
                    </div>
                  </div>
                  <div className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/20">
                    <div className="text-yellow-400 text-sm">Secrets Found</div>
                    <div className="text-white text-xl font-bold">
                      {results.summary?.secrets_detected || results.analysis_summary?.secrets_detected || 0}
                    </div>
                  </div>
                  <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
                    <div className="text-purple-400 text-sm">Vulnerabilities</div>
                    <div className="text-white text-xl font-bold">
                      {results.summary?.vulnerabilities_detected || results.analysis_summary?.vulnerabilities_detected || 0}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HIBP Breach Results */}
            {results.osint_results?.hibp_results && results.osint_results.hibp_results.length > 0 && (
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">HIBP Breach Results</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {results.osint_results.hibp_results.slice(0, 10).map((result: any, idx: number) => (
                    <p key={idx} className="text-gray-300 text-sm">
                      📧 {result.email}: <span className="text-green-400">{result.status}</span>
                    </p>
                  ))}
                  {results.osint_results.hibp_results.length > 10 && (
                    <p className="text-blue-400 text-sm">
                      ...See more ({results.osint_results.hibp_results.length - 10} more entries)
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Data Preview */}
            {results.data_preview && (
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Cleaned Data Preview (Redacted)</h4>
                <div className="bg-gray-900/50 p-3 rounded text-xs text-gray-300 max-h-40 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{results.data_preview.redacted_content}</pre>
                </div>
                {results.data_preview.redaction_summary && (
                  <p className="text-gray-400 text-xs mt-2">{results.data_preview.redaction_summary}</p>
                )}
              </div>
            )}

            {/* Risk Assessment */}
            {results.risk_assessment && (
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Risk Assessment</h4>
                <p className="text-gray-300 text-sm">
                  Overall Risk: <span className="font-semibold text-orange-400">
                    {results.risk_assessment.overall_risk?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </p>
                {results.risk_assessment.confidence_score > 0 && (
                  <p className="text-gray-300 text-sm">
                    Confidence Score: <span className="text-blue-400">{results.risk_assessment.confidence_score}</span>
                  </p>
                )}
                {results.risk_assessment.ai_summary && (
                  <p className="text-gray-300 text-sm mt-2">{results.risk_assessment.ai_summary}</p>
                )}
              </div>
            )}

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {results.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-gray-300 text-sm">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw Debug Data */}
            <details className="bg-gray-800/50 rounded-lg">
              <summary className="p-3 text-gray-400 cursor-pointer hover:text-white">
                🔍 View Raw Analysis Data (Debug)
              </summary>
              <div className="p-3 border-t border-gray-700">
                <pre className="text-xs text-gray-300 overflow-auto max-h-60 bg-gray-900/50 p-3 rounded">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

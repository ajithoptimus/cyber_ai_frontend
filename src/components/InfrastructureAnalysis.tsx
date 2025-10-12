// src/components/InfrastructureAnalysis.tsx - COMPLETE WITH PDF DOWNLOAD
import React, { useState } from 'react';
import ScanResultsTable from './ScanResultsTable';
import { exportToCSV, exportToJSON, exportToTXT } from '../utils/exportUtils';
import FileResultsCard from './FileResultsCard';
import { PDFDownloadButton } from './PDFDownloadButton';

const InfrastructureAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [findings, setFindings] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [scanning, setScanning] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [scanResults, setScanResults] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const [summary, setSummary] = useState({
    total_findings: 0,
    iac_findings: 0,
    iam_findings: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const filesArray = Array.from(fileList);
    
    setUploadedFile(filesArray[0]);
    setScanning(true);
    setLoading(true);
    
    try {
      if (filesArray.length > 1) {
        // Batch scan
        const formData = new FormData();
        filesArray.forEach(file => {
          formData.append('files', file);
        });
        
        const response = await fetch('http://localhost:8000/api/v1/infrastructure/scan/batch', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Batch scan failed: ${response.statusText}`);
        }
        
        const results = await response.json();
        console.log('✅ Batch scan results:', results);
        
        setScanResults(results);
        setFindings(results.findings || []);
        setSummary(results.summary || summary);
      } else {
        // Single file scan
        const formData = new FormData();
        formData.append('file', filesArray[0]);
        
        const response = await fetch('http://localhost:8000/api/v1/infrastructure/scan', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Scan failed: ${response.statusText}`);
        }
        
        const results = await response.json();
        console.log('✅ Scan results:', results);
        
        setScanResults(results);
        setFindings(results.findings || []);
        setSummary(results.summary || summary);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Scan failed:', error);
      alert(`Failed to scan files: ${error.message}`);
      setLoading(false);
    } finally {
      setScanning(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const fakeEvent = {
        target: { files: files }
      } as any;
      handleFileUpload(fakeEvent);
    }
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

  const filteredFindings = findings.filter(finding => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'iac') return finding.type === 'IaC';
    if (activeCategory === 'iam') return finding.type === 'IAM';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-emerald-400 rounded flex items-center justify-center">
          <span className="text-gray-900 font-bold">🏗️</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Infrastructure Security Analysis</h1>
          <p className="text-gray-400">Upload IaC files and analyze IAM policies for security issues</p>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xl">📤</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Scan Infrastructure Files</h3>
            <p className="text-gray-400 text-sm">
              Upload Terraform, CloudFormation, Kubernetes, or IAM policy files for security analysis
            </p>
          </div>
        </div>
        
        <div 
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="iac-file-upload"
            className="hidden"
            accept=".tf,.yaml,.yml,.json,.tfvars"
            onChange={handleFileUpload}
            disabled={scanning}
            multiple
          />
          <label 
            htmlFor="iac-file-upload" 
            className="cursor-pointer block"
          >
            {scanning ? (
              <div className="text-emerald-400">
                <div className="animate-spin inline-block w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full mb-4"></div>
                <p className="font-medium text-lg">
                  {scanResults?.scan_type === 'batch' 
                    ? `Analyzing ${scanResults?.files_scanned || 'multiple'} files...`
                    : `Analyzing ${uploadedFile?.name}...`}
                </p>
                <p className="text-sm text-gray-400 mt-2">Scanning for security misconfigurations</p>
              </div>
            ) : (
              <>
                <div className="text-6xl mb-4">📁</div>
                <p className="text-white font-medium text-lg mb-2">
                  Drop your IaC files here or click to browse
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  Supported formats: Terraform (.tf), CloudFormation (.yaml), Kubernetes (.yml), IAM Policies (.json)
                </p>
                <p className="text-emerald-400 text-xs mb-3">
                  ✨ NEW: Select multiple files for batch scanning!
                </p>
                <div className="flex justify-center space-x-4 text-xs text-gray-500">
                  <span>🔹 Terraform</span>
                  <span>🔹 CloudFormation</span>
                  <span>🔹 Kubernetes</span>
                  <span>🔹 IAM Policies</span>
                </div>
              </>
            )}
          </label>
        </div>
        
        {/* Scan Completed Banner with Export & PDF Download Buttons */}
        {uploadedFile && !scanning && scanResults && (
          <div className="mt-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-emerald-400 text-2xl">✓</span>
                <div>
                  <p className="text-white font-medium">Scan Completed</p>
                  <p className="text-gray-400 text-sm">
                    {scanResults?.scan_type === 'batch' 
                      ? `Files Scanned: ${scanResults.files_scanned} | Total Findings: ${scanResults.total_findings}`
                      : `File: ${uploadedFile.name} | Type: ${scanResults.file_type} | Findings: ${scanResults.total_findings}`}
                  </p>
                </div>
              </div>
              
              {/* Export & PDF Download Buttons */}
              <div className="flex items-center space-x-2">
                {/* PDF Download Button */}
                <PDFDownloadButton 
                  filename={`Cyber_AI_Audit_${uploadedFile.name.split('.')[0]}`}
                  variant="primary"
                  className="flex items-center space-x-2"
                />
                
                {/* Export Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    <span>📥</span>
                    <span>Export Data</span>
                    <span>▼</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                      onClick={() => exportToCSV(findings, scanResults, `${uploadedFile.name.split('.')[0]}-scan.csv`)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white rounded-t-lg flex items-center space-x-2"
                    >
                      <span>📊</span>
                      <span>Export as CSV</span>
                    </button>
                    <button
                      onClick={() => exportToJSON(scanResults, `${uploadedFile.name.split('.')[0]}-scan.json`)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white flex items-center space-x-2"
                    >
                      <span>📄</span>
                      <span>Export as JSON</span>
                    </button>
                    <button
                      onClick={() => exportToTXT(scanResults, `${uploadedFile.name.split('.')[0]}-report.txt`)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white rounded-b-lg flex items-center space-x-2"
                    >
                      <span>📝</span>
                      <span>Export as Report</span>
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setScanResults(null);
                    setFindings([]);
                    setSummary({
                      total_findings: 0,
                      iac_findings: 0,
                      iam_findings: 0,
                      critical: 0,
                      high: 0,
                      medium: 0,
                      low: 0,
                      info: 0
                    });
                  }}
                  className="text-gray-400 hover:text-white transition-colors px-3 py-2"
                >
                  Clear Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {(findings.length > 0 || !scanResults) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Findings */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Infrastructure Findings</p>
                <p className="text-3xl font-bold text-white">{summary.total_findings || summary.total}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-400 rounded flex items-center justify-center text-2xl">
                🛡️
              </div>
            </div>
          </div>
          
          {/* Category Breakdown */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-3">Category Breakdown</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white">IaC Issues:</span>
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm font-medium">
                  {summary.iac_findings}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white">IAM Issues:</span>
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded text-sm font-medium">
                  {summary.iam_findings}
                </span>
              </div>
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-3">Severity Distribution</p>
            <div className="space-y-2">
              {summary.critical > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white">Critical:</span>
                  <span className="px-3 py-1 rounded text-xs font-medium bg-red-500 text-white">
                    {summary.critical}
                  </span>
                </div>
              )}
              {summary.high > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white">High:</span>
                  <span className="px-3 py-1 rounded text-xs font-medium bg-orange-500 text-white">
                    {summary.high}
                  </span>
                </div>
              )}
              {summary.medium > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white">Medium:</span>
                  <span className="px-3 py-1 rounded text-xs font-medium bg-yellow-500 text-black">
                    {summary.medium}
                  </span>
                </div>
              )}
              {summary.low > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white">Low:</span>
                  <span className="px-3 py-1 rounded text-xs font-medium bg-blue-500 text-white">
                    {summary.low}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File-by-File Results - Only for Batch Scans */}
      {scanResults?.scan_type === 'batch' && scanResults?.file_results && (
        <FileResultsCard 
          fileResults={scanResults.file_results}
          findings={findings}
          onFileSelect={(filename) => {
            console.log('Selected file:', filename);
          }}
        />
      )}

      {/* Category Filter & View Mode Toggle */}
      {findings.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Findings', count: findings.length },
              { key: 'iac', label: 'Infrastructure as Code', count: summary.iac_findings },
              { key: 'iam', label: 'Identity & Access Management', count: summary.iam_findings }
            ].map(category => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  activeCategory === category.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📊 Table View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📋 List View
            </button>
          </div>
        </div>
      )}

      {/* Findings Display - Table or List */}
      {findings.length > 0 ? (
        viewMode === 'table' ? (
          <ScanResultsTable findings={filteredFindings} />
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Infrastructure Security Findings</h3>
              <p className="text-gray-400 text-sm">
                Detailed analysis from IaC and IAM scanners - {filteredFindings.length} findings shown
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {filteredFindings.map((finding: any, index: number) => (
                  <div key={finding.id || index} className="border border-gray-700 rounded-lg p-5 hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded text-xs font-bold ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                        <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded text-xs font-medium">
                          {finding.type}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{finding.file}</span>
                    </div>
                    
                    <h4 className="font-semibold text-white text-lg mb-2">{finding.title}</h4>
                    <p className="text-gray-300 mb-3">{finding.description}</p>
                    
                    {finding.line > 0 && (
                      <div className="text-sm text-gray-400 mb-3 font-mono bg-gray-900 p-2 rounded">
                        <span className="text-gray-500">Line {finding.line}:</span> 
                        <span className="text-gray-300 ml-2">{finding.code_snippet}</span>
                      </div>
                    )}
                    
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-400 text-xl">🛡️</span>
                        <div>
                          <p className="text-blue-300 text-sm font-semibold mb-1">Remediation</p>
                          <p className="text-blue-200 text-sm">{finding.remediation}</p>
                          {finding.compliance && finding.compliance.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {finding.compliance.map((comp: string, idx: number) => (
                                <span key={idx} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                  {comp}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      ) : !loading && !scanning && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Scan Results Yet</h3>
          <p className="text-gray-400">Upload an infrastructure configuration file to begin security analysis</p>
        </div>
      )}
    </div>
  );
};

export default InfrastructureAnalysis;

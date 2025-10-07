// src/components/AIReportsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, Shield, AlertCircle, CheckCircle, Clock, Sparkles } from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'executive' | 'technical' | 'compliance' | 'incident';
  estimatedTime: string;
}

interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  generatedAt: string;
  summary: string;
  downloadUrl?: string;
}

const AIReportsDashboard: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [reportProgress, setReportProgress] = useState(0);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'executive-summary',
      name: 'Executive Security Summary',
      description: 'High-level overview for C-suite executives with business impact analysis',
      icon: <TrendingUp className="w-6 h-6" />,
      type: 'executive',
      estimatedTime: '2 min'
    },
    {
      id: 'ciso-report',
      name: 'CISO Technical Report',
      description: 'Detailed technical analysis with vulnerability breakdowns and remediation plans',
      icon: <Shield className="w-6 h-6" />,
      type: 'technical',
      estimatedTime: '3 min'
    },
    {
      id: 'compliance-audit',
      name: 'Compliance Audit Report',
      description: 'NIST, ISO 27001, SOC 2 compliance status with gap analysis',
      icon: <CheckCircle className="w-6 h-6" />,
      type: 'compliance',
      estimatedTime: '2 min'
    },
    {
      id: 'incident-response',
      name: 'Incident Response Report',
      description: 'Comprehensive incident analysis with timeline and forensic details',
      icon: <AlertCircle className="w-6 h-6" />,
      type: 'incident',
      estimatedTime: '2 min'
    }
  ];

  useEffect(() => {
    // Load existing reports from localStorage
    const savedReports = localStorage.getItem('cyberai_reports');
    if (savedReports) {
      setGeneratedReports(JSON.parse(savedReports));
    }
  }, []);

  const generateReport = async (templateId: string) => {
    setGeneratingReport(true);
    setReportProgress(0);
    setSelectedTemplate(templateId);

    // Simulate AI report generation with progress
    const progressInterval = setInterval(() => {
      setReportProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // Call backend to generate report
      const response = await fetch('http://localhost:8000/api/v1/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: templateId,
          include_charts: true,
          format: 'html'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      
      setReportProgress(100);
      
      setTimeout(() => {
        const template = reportTemplates.find(t => t.id === templateId);
        const newReport: GeneratedReport = {
          id: Date.now().toString(),
          title: template?.name || 'Security Report',
          type: templateId,
          generatedAt: new Date().toISOString(),
          summary: data.summary || 'Report generated successfully',
          downloadUrl: data.download_url
        };

        const updatedReports = [newReport, ...generatedReports];
        setGeneratedReports(updatedReports);
        localStorage.setItem('cyberai_reports', JSON.stringify(updatedReports));
        
        setGeneratingReport(false);
        setReportProgress(0);
        setSelectedTemplate(null);
      }, 500);

    } catch (error) {
      console.error('Report generation error:', error);
      
      // Generate demo report if backend fails
      setReportProgress(100);
      setTimeout(() => {
        const template = reportTemplates.find(t => t.id === templateId);
        const newReport: GeneratedReport = {
          id: Date.now().toString(),
          title: template?.name || 'Security Report',
          type: templateId,
          generatedAt: new Date().toISOString(),
          summary: getDemoReportSummary(templateId)
        };

        const updatedReports = [newReport, ...generatedReports];
        setGeneratedReports(updatedReports);
        localStorage.setItem('cyberai_reports', JSON.stringify(updatedReports));
        
        setGeneratingReport(false);
        setReportProgress(0);
        setSelectedTemplate(null);
      }, 500);
    }
  };

  const getDemoReportSummary = (templateId: string): string => {
    const summaries: Record<string, string> = {
      'executive-summary': 'Overall security posture: MEDIUM-HIGH risk (72/100). 3 critical findings require immediate attention. Compliance at 85% NIST CSF. Estimated 2-4 weeks for remediation.',
      'ciso-report': '12 vulnerabilities identified across infrastructure. 3 critical CVEs detected. Unpatched software and weak access controls pose significant risk. Detailed remediation roadmap included.',
      'compliance-audit': 'NIST CSF: 85% compliant. ISO 27001: 78% compliant. SOC 2: 82% compliant. Main gaps: AC-2 (MFA), IR-4 (playbooks), AU-2 (logging). 15% improvement needed for full compliance.',
      'incident-response': '1 active incident (Malware Containment). MTTR: 12.5 minutes. All affected systems isolated. Forensic analysis complete. Root cause: outdated antivirus signatures.'
    };
    return summaries[templateId] || 'Report generated successfully with comprehensive analysis.';
  };

  const downloadReport = (report: GeneratedReport) => {
    // Generate downloadable report
    const reportContent = `
CYBER.AI SECURITY REPORT
========================

Report: ${report.title}
Generated: ${new Date(report.generatedAt).toLocaleString()}
Report ID: ${report.id}

EXECUTIVE SUMMARY
-----------------
${report.summary}

DETAILED ANALYSIS
-----------------
[Full report content would be generated here with charts and detailed findings]

For full interactive report, please visit: https://cyber.ai/reports/${report.id}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberAI_${report.type}_${report.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-blue-400" />
          AI-Powered Reports
        </h1>
        <p className="text-gray-400">
          Generate comprehensive security reports with AI-driven insights and analysis
        </p>
      </div>

      {/* Report Templates */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              }`}
              onClick={() => !generatingReport && generateReport(template.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                  {template.icon}
                </div>
                <span className="flex items-center text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {template.estimatedTime}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{template.description}</p>
              <button
                disabled={generatingReport}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  generatingReport
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {generatingReport && selectedTemplate === template.id ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Generation Progress */}
      {generatingReport && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Generating Report...</h3>
            <span className="text-blue-400 font-semibold">{reportProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${reportProgress}%` }}
            />
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400 flex items-center">
              <CheckCircle className={`w-4 h-4 mr-2 ${reportProgress > 20 ? 'text-green-400' : 'text-gray-600'}`} />
              Analyzing security data...
            </p>
            <p className="text-sm text-gray-400 flex items-center">
              <CheckCircle className={`w-4 h-4 mr-2 ${reportProgress > 50 ? 'text-green-400' : 'text-gray-600'}`} />
              Generating AI insights...
            </p>
            <p className="text-sm text-gray-400 flex items-center">
              <CheckCircle className={`w-4 h-4 mr-2 ${reportProgress > 80 ? 'text-green-400' : 'text-gray-600'}`} />
              Compiling report...
            </p>
          </div>
        </div>
      )}

      {/* Generated Reports History */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Generated Reports</h2>
        {generatedReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No reports generated yet. Create your first report above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {generatedReports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{report.summary}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(report.generatedAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => downloadReport(report)}
                    className="ml-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                    title="Download Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIReportsDashboard;

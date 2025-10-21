import React, { useState } from 'react';
import { AlertTriangle, ClipboardCopy, Check } from 'lucide-react';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

interface SuggestedFix {
  type: 'REPLACE_LINE' | 'REPLACE_BLOCK' | 'COMMAND';
  file: string | null;
  start_line: number;
  end_line: number;
  new_content: string;
}

interface Finding {
  title: string;
  severity: Severity;
  file: string;
  line: number | null;
  description: string;
  solution_summary: string;
  suggested_fix: SuggestedFix;
}

interface Analysis {
  overall_risk_score: number;
  summary: string;
  prioritized_findings: Finding[];
}

interface ScanResultsDisplayProps {
  analysis: Analysis;
}

// Utility functions for stylings
const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case 'CRITICAL': return 'bg-red-600 text-white';
    case 'HIGH':     return 'bg-orange-500 text-white';
    case 'MEDIUM':   return 'bg-yellow-500 text-gray-900';
    default:         return 'bg-gray-400 text-gray-900';
  }
};

const getScoreColor = (score: number) => {
  if (score > 8.0) return 'text-red-500';
  if (score > 6.0) return 'text-orange-400';
  if (score > 4.0) return 'text-yellow-300';
  return 'text-green-400';
};

const ScanResultsDisplay: React.FC<ScanResultsDisplayProps> = ({ analysis }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const findings = analysis?.prioritized_findings || [];

  const handleCopy = async (content: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch {}
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full p-6 text-gray-100 overflow-y-auto">
      {/* Summary Card */}
      <div className="flex items-center gap-6 bg-gray-800 rounded-lg border border-gray-700 shadow mb-8 p-6">
        <div className={`text-5xl font-extrabold ${getScoreColor(analysis?.overall_risk_score ?? 0)}`}>
          {typeof analysis?.overall_risk_score === 'number'
            ? analysis.overall_risk_score.toFixed(1)
            : '--'}
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold mb-1">Scan Summary</div>
          <div className="text-gray-300">{analysis?.summary || "No summary available."}</div>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-5">
        {findings.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400 border border-gray-700">
            No prioritized findings were detected in this analysis.
          </div>
        ) : findings.map((finding, idx) => (
          <div
            key={idx}
            className="bg-gray-800 border rounded-lg border-gray-700 shadow"
          >
            {/* Collapsible Header */}
            <button
              className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span className="flex items-center gap-2 font-semibold text-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-1" />
                {finding.title}
                <span className={`ml-3 px-2 py-1 text-xs rounded-full font-bold ${getSeverityColor(finding.severity)}`}>
                  {finding.severity}
                </span>
              </span>
              <span>
                <svg
                  width="18"
                  height="18"
                  className={`inline transition-transform ${openIndex === idx ? 'rotate-90' : 'rotate-0'}`}
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 9l6 0" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 6l0 6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 pt-2 text-sm space-y-4">
                {/* Location */}
                <div className="flex gap-3 text-gray-400">
                  <span className="font-mono bg-gray-900/40 px-2 py-1 rounded">
                    {finding.file}
                  </span>
                  {finding.line !== null && finding.line !== undefined && (
                    <span className="font-mono bg-gray-900/40 px-2 py-1 rounded">
                      Line {finding.line}
                    </span>
                  )}
                </div>
                {/* Details */}
                <div>
                  <div className="mb-1 font-semibold text-gray-200">Description:</div>
                  <div className="text-gray-300">{finding.description}</div>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-gray-200">Solution Summary:</div>
                  <div className="text-gray-300">{finding.solution_summary}</div>
                </div>
                {/* Suggested Fix */}
                <div>
                  <div className="mb-1 font-semibold text-gray-200">
                    Suggested fix for{" "}
                    <span className="font-mono bg-gray-900/40 px-2 py-1 rounded">{finding.suggested_fix.file ?? finding.file}</span>
                  </div>
                  <div className="relative bg-gray-900/50 rounded-lg border border-gray-700 px-4 pt-3 pb-2 font-mono text-sm text-gray-100 whitespace-pre-wrap">
                    {/* Code Content */}
                    {finding.suggested_fix.new_content}
                    {/* Copy Code button */}
                    <button
                      onClick={() => handleCopy(finding.suggested_fix.new_content, idx)}
                      className="absolute right-4 top-3 flex items-center gap-1 bg-gray-700/70 hover:bg-gray-600 text-gray-100 px-2 py-1 rounded transition"
                      style={{ fontSize: '12px' }}
                      aria-label="Copy code"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" /> Copied
                        </>
                      ) : (
                        <>
                          <ClipboardCopy className="w-4 h-4" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanResultsDisplay;

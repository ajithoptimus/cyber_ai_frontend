import React, { useState } from "react";
import "./ScanResultsTable.css";

interface Finding {
  id: number;
  type: string;
  severity: string;
  title: string;
  description: string;
  file: string;
  line: number;
  code_snippet: string;
  remediation: string;
  compliance: string[];
}

interface Props {
  findings: Finding[];
}

const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const severityColors = {
  CRITICAL: "#dc2626",
  HIGH: "#ea580c",
  MEDIUM: "#f59e0b",
  LOW: "#84cc16"
};

export const ScanResultsTable: React.FC<Props> = ({ findings }) => {
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filteredResults = filterSeverity 
    ? findings.filter(f => f.severity === filterSeverity)
    : findings;

  const sortedResults = [...filteredResults].sort((a, b) => 
    severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  return (
    <div className="scan-results-table">
      {/* Filter Buttons */}
      <div className="filter-section">
        <h3>Filter by Severity</h3>
        <div className="filter-buttons">
          <button 
            onClick={() => setFilterSeverity(null)}
            className={filterSeverity === null ? "active all" : ""}
          >
            All ({findings.length})
          </button>
          {severityOrder.map(level => {
            const count = findings.filter(f => f.severity === level).length;
            return (
              <button 
                key={level} 
                onClick={() => setFilterSeverity(filterSeverity === level ? null : level)}
                className={filterSeverity === level ? `active ${level.toLowerCase()}` : level.toLowerCase()}
              >
                {level} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Type</th>
              <th>Title</th>
              <th>File</th>
              <th>Line</th>
              <th>Compliance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map(finding => (
              <React.Fragment key={finding.id}>
                <tr 
                  className="finding-row"
                  onClick={() => setExpandedRow(expandedRow === finding.id ? null : finding.id)}
                >
                  <td>
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: severityColors[finding.severity as keyof typeof severityColors] }}
                    >
                      {finding.severity}
                    </span>
                  </td>
                  <td>
                    <span className="type-badge">{finding.type}</span>
                  </td>
                  <td className="title-cell">{finding.title}</td>
                  <td className="file-cell">{finding.file}</td>
                  <td className="line-cell">{finding.line}</td>
                  <td className="compliance-cell">
                    {finding.compliance.map((c, idx) => (
                      <span key={idx} className="compliance-badge">{c}</span>
                    ))}
                  </td>
                  <td>
                    <button className="expand-btn">
                      {expandedRow === finding.id ? "▼" : "▶"}
                    </button>
                  </td>
                </tr>
                {expandedRow === finding.id && (
                  <tr className="expanded-row">
                    <td colSpan={7}>
                      <div className="expanded-content">
                        <div className="section">
                          <h4>Description</h4>
                          <p>{finding.description}</p>
                        </div>
                        <div className="section">
                          <h4>Code Snippet</h4>
                          <pre><code>{finding.code_snippet}</code></pre>
                        </div>
                        <div className="section">
                          <h4>Remediation</h4>
                          <p>{finding.remediation}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="results-summary">
        <p>Showing {sortedResults.length} of {findings.length} findings</p>
      </div>
    </div>
  );
};

export default ScanResultsTable;

// src/components/CompoundRisksPanel.tsx
import React from 'react';
import type { CompoundRisk } from '../types/riskScore.types';

interface CompoundRisksPanelProps {
  risks: CompoundRisk[];
}

export const CompoundRisksPanel: React.FC<CompoundRisksPanelProps> = ({ risks }) => {
  if (risks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔗 Compound Risks (Attack Chains)</h3>
        <p className="text-gray-500 text-center py-8">No compound risks detected</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        🔗 Compound Risks (Attack Chains)
        <span className="ml-2 text-sm font-normal text-gray-500">
          {risks.length} active
        </span>
      </h3>

      <div className="space-y-4">
        {risks.map((risk) => (
          <div 
            key={risk.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{risk.component}</h4>
                <p className="text-xs text-gray-500">
                  Detected: {new Date(risk.detected_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {risk.final_risk_score.toFixed(0)}
                </div>
                <div className="text-xs text-red-600 font-semibold">
                  {risk.priority}
                </div>
              </div>
            </div>

            {/* Risk Calculation */}
            <div className="bg-gray-50 rounded p-2 mb-3 text-sm">
              <span className="text-gray-600">Base Risk:</span>
              <span className="ml-2 font-semibold">{risk.base_risk_score.toFixed(0)}</span>
              <span className="mx-2">×</span>
              <span className="text-gray-600">Multiplier:</span>
              <span className="ml-2 font-semibold">{risk.compound_multiplier}x</span>
              <span className="mx-2">=</span>
              <span className="text-red-600 font-bold">{risk.final_risk_score.toFixed(0)}</span>
            </div>

            {/* Attack Scenarios */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Attack Scenarios:
              </p>
              <ul className="space-y-1">
                {risk.attack_scenarios.map((scenario, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                    <span className="mr-2">→</span>
                    <span>{scenario}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
              <span>{risk.affected_resources} resources affected</span>
              <span className={`font-semibold ${
                risk.status === 'active' ? 'text-red-600' : 
                risk.status === 'mitigated' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {risk.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

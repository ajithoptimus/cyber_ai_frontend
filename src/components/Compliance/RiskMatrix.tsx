import React from 'react';

const RiskMatrix: React.FC = () => {
  const matrix = [
    [
      { level: 'Low', count: 2, color: 'bg-green-600' },
      { level: 'Low', count: 3, color: 'bg-green-500' },
      { level: 'Medium', count: 1, color: 'bg-yellow-500' },
      { level: 'Medium', count: 0, color: 'bg-orange-500' },
      { level: 'High', count: 0, color: 'bg-red-500' }
    ],
    [
      { level: 'Low', count: 4, color: 'bg-green-500' },
      { level: 'Medium', count: 2, color: 'bg-yellow-500' },
      { level: 'Medium', count: 1, color: 'bg-orange-500' },
      { level: 'High', count: 1, color: 'bg-red-500' },
      { level: 'Critical', count: 0, color: 'bg-red-700' }
    ],
    [
      { level: 'Medium', count: 1, color: 'bg-yellow-500' },
      { level: 'Medium', count: 2, color: 'bg-orange-500' },
      { level: 'High', count: 3, color: 'bg-red-500' },
      { level: 'Critical', count: 1, color: 'bg-red-700' },
      { level: 'Critical', count: 0, color: 'bg-red-900' }
    ],
    [
      { level: 'Medium', count: 0, color: 'bg-orange-500' },
      { level: 'High', count: 1, color: 'bg-red-500' },
      { level: 'Critical', count: 2, color: 'bg-red-700' },
      { level: 'Critical', count: 1, color: 'bg-red-800' },
      { level: 'Critical', count: 0, color: 'bg-red-900' }
    ],
    [
      { level: 'High', count: 0, color: 'bg-red-500' },
      { level: 'Critical', count: 0, color: 'bg-red-700' },
      { level: 'Critical', count: 1, color: 'bg-red-800' },
      { level: 'Critical', count: 0, color: 'bg-red-900' },
      { level: 'Critical', count: 0, color: 'bg-red-950' }
    ]
  ];

  const likelihood = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
  const impact = ['Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic'];

  return (
    <div>
      <div className="grid grid-cols-6 gap-2">
        {/* Empty top-left cell */}
        <div className="text-xs text-gray-400 flex items-center justify-center">
          <span className="transform -rotate-45">Impact →</span>
        </div>
        
        {/* Impact labels (top row) */}
        {impact.map((label, index) => (
          <div key={index} className="text-xs text-gray-400 text-center font-semibold">
            {label}
          </div>
        ))}

        {/* Matrix rows */}
        {matrix.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Likelihood label (left column) */}
            <div className="text-xs text-gray-400 flex items-center justify-end pr-2 font-semibold">
              {likelihood[rowIndex]}
            </div>
            
            {/* Matrix cells */}
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`${cell.color} rounded-lg p-4 flex flex-col items-center justify-center hover:opacity-80 transition-opacity cursor-pointer`}
              >
                <span className="text-white font-bold text-lg">{cell.count}</span>
                <span className="text-white/80 text-xs">{cell.level}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-400">Low Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-400">Medium Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-gray-400">High Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-700 rounded"></div>
          <span className="text-gray-400">Critical Risk</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;

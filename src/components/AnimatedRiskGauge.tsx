import React, { useState, useEffect } from 'react';

interface AnimatedRiskGaugeProps {
  score: number;
  level: string;
  animated?: boolean;
}

export const AnimatedRiskGauge: React.FC<AnimatedRiskGaugeProps> = ({ 
  score = 0, 
  level = 'UNKNOWN', 
  animated = true 
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score counting up
  useEffect(() => {
    let start = 0;
    const end = Math.max(0, Math.min(10, score)); // Clamp between 0-10
    const increment = end / 30;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [score]);

  // Safe level processing with validation
  const safeLevel = (level || 'UNKNOWN').toString().toUpperCase();
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 10) * circumference;
  
  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'LOW': return 'text-green-500 stroke-green-500';
      case 'MEDIUM': return 'text-yellow-500 stroke-yellow-500';
      case 'HIGH': return 'text-orange-500 stroke-orange-500';
      case 'CRITICAL': return 'text-red-500 stroke-red-500';
      default: return 'text-blue-500 stroke-blue-500';
    }
  };

  const colorClass = getRiskColor(safeLevel);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32 -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-700/30"
        />
        {/* Animated progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClass} ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
          style={{
            transform: 'rotate(0deg)',
            transformOrigin: '50% 50%'
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold tabular-nums ${colorClass}`}>
          {displayScore.toFixed(1)}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
          {safeLevel}
        </span>
      </div>
    </div>
  );
};

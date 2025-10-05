import React from 'react';
import { BookOpen, Play } from 'lucide-react';

interface Props {
  playbook: {
    id: number;
    name: string;
    description: string;
    execution_count: number;
    success_rate: number;
  };
}

const PlaybookCard: React.FC<Props> = ({ playbook }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <BookOpen className="w-6 h-6 text-blue-400 mb-2" />
      <h3 className="font-semibold text-white mb-2 text-sm">{playbook.name}</h3>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{playbook.description}</p>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 text-gray-400">
          <Play className="w-3 h-3" />
          <span>{playbook.execution_count} runs</span>
        </div>
        <span className="text-green-400">{playbook.success_rate.toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default PlaybookCard;

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface ScanSummaryPreviewProps {
  summary: string;
  onSeeMore: () => void;
  maxLines?: number;
}

export const ScanSummaryPreview: React.FC<ScanSummaryPreviewProps> = ({
  summary,
  onSeeMore,
  maxLines = 3,
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
        const maxHeight = lineHeight * maxLines;
        setIsTruncated(element.scrollHeight > maxHeight + 5); // +5px tolerance
      }
    };

    // Check immediately
    checkTruncation();

    // Re-check on resize
    const resizeObserver = new ResizeObserver(checkTruncation);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [summary, maxLines]);

  const lineClampClass = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
  }[maxLines as keyof typeof lineClampClass] || 'line-clamp-3';

  return (
    <div className="space-y-2">
      <div
        ref={contentRef}
        className={`${lineClampClass} text-sm text-gray-300 leading-relaxed font-mono break-words`}
      >
        {summary}
      </div>

      {isTruncated && (
        <button
          onClick={onSeeMore}
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-all text-sm font-semibold group"
          aria-label="View full scan results"
        >
          See more details
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ScanSummaryPreview;

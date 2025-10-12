// src/components/PDFDownloadButton.tsx
import React, { useState } from 'react';
import { riskScoreApi } from '../services/riskScoreApi';

interface PDFDownloadButtonProps {
  scanId?: string;
  filename?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  scanId,
  filename = 'Cyber_AI_Security_Audit',
  variant = 'primary',
  className = ''
}) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);

      // Call API to get PDF blob
      const pdfBlob = await riskScoreApi.downloadPDFReport(scanId);

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ PDF downloaded successfully');

    } catch (err: any) {
      console.error('❌ PDF download failed:', err);
      setError(err.response?.data?.detail || 'Failed to download PDF report');
    } finally {
      setDownloading(false);
    }
  };

  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = variant === 'primary'
    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300";

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`${baseClasses} ${variantClasses} ${className}`}
      >
        {downloading ? (
          <>
            {/* Loading spinner */}
            <svg 
              className="animate-spin h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            {/* Download icon */}
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            Download PDF Report
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Copy, Check } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  repoName: string;
  status: string;
}

export const ScanResultsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  summary,
  repoName,
  status,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform bg-gray-800 border border-gray-700 rounded-lg shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between bg-gray-900 px-6 py-5 border-b border-gray-700">
                  <div className="flex-1">
                    <Dialog.Title className="text-2xl font-bold text-white">
                      📋 Scan Report
                    </Dialog.Title>
                    <p className="text-sm text-gray-400 mt-2">
                      Repository: <span className="font-semibold text-indigo-400">{repoName}</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Status: <span className={`font-semibold ${
                        status === 'completed' ? 'text-green-400' : 
                        status === 'failed' || status === 'error' ? 'text-red-400' : 
                        'text-yellow-400'
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0"
                    aria-label="Close dialog"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-5 font-mono text-sm leading-relaxed text-gray-100 whitespace-pre-wrap break-words">
                    {summary || 'No scan results available.'}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-900 px-6 py-4 border-t border-gray-700 flex justify-between gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors font-medium text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Results
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    Close Results
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ScanResultsModal;

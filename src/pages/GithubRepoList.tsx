import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ScanResultsModal from "../components/ScanResultsModal";
import ScanSummaryPreview from "../components/ScanSummaryPreview";
import { ExternalLink, AlertCircle, CheckCircle, XCircle, Loader } from "lucide-react";

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  description?: string;
}

interface ScanStatusData {
  status: string;
  summary?: string;
  scan_id?: string; // ✅ NEW: Track the scan ID for cancellation
}

const GithubRepoList: React.FC = () => {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<{ [repoId: number]: ScanStatusData }>({});
  const [isScanning, setIsScanning] = useState<{ [repoId: number]: boolean }>({});
  const [isCancelling, setIsCancelling] = useState<{ [repoId: number]: boolean }>({});
  const [selectedRepoForModal, setSelectedRepoForModal] = useState<GithubRepo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/api/v1/github/repos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        setRepos(data || []);
      } catch (err: any) {
        setError(err.message || "Error fetching repositories");
      } finally {
        setLoading(false);
      }
    };

    if (token && isLoggedIn) {
      fetchRepos();
    }
  }, [token, isLoggedIn]);

  const triggerScan = async (repo: GithubRepo) => {
    if (!token) return;

    setIsScanning((prev) => ({ ...prev, [repo.id]: true }));
    setScanStatus((prev) => ({ ...prev, [repo.id]: { status: "Starting..." } }));

    try {
      const response = await fetch("http://localhost:8000/api/v1/scanner/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          repository_url: repo.html_url,
          repo_id: repo.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Scan initiation failed");
      }
      const data = await response.json();
      const scan_id = data.scan_id;
      setScanStatus((prev) => ({
        ...prev,
        [repo.id]: { status: "Scanning...", scan_id }, // ✅ Store scan_id
      }));

      pollScanStatus(scan_id, repo.id, token);
    } catch (err: any) {
      setScanStatus((prev) => ({ ...prev, [repo.id]: { status: "Scan failed!" } }));
      setIsScanning((prev) => ({ ...prev, [repo.id]: false }));
    }
  };

  const pollScanStatus = async (scanId: string, repoId: number, currentToken: string) => {
    let polling = true;
    let pollAttempts = 0;
    const maxPollAttempts = 300;

    while (polling && pollAttempts < maxPollAttempts) {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/scanner/scans/${scanId}`,
          {
            headers: { Authorization: `Bearer ${currentToken}` },
          }
        );

        if (res.status === 401) {
          console.warn("Token expired during polling, stopping...");
          setScanStatus((prev) => ({
            ...prev,
            [repoId]: {
              status: "Session expired - please refresh and retry",
              summary: "",
            },
          }));
          setIsScanning((prev) => ({ ...prev, [repoId]: false }));
          polling = false;
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch scan status: ${res.status}`);
        }

        const data = await res.json();
        const finished = ["completed", "error", "failed", "cancelled"].includes(data.status);

        setScanStatus((prev) => ({
          ...prev,
          [repoId]: {
            status: finished ? data.status : "Scanning...",
            summary: data.summary || "",
            scan_id: scanId,
          },
        }));

        if (finished) {
          setIsScanning((prev) => ({ ...prev, [repoId]: false }));
          polling = false;
        } else {
          pollAttempts++;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (err: any) {
        console.error("Polling error:", err);
        setScanStatus((prev) => ({
          ...prev,
          [repoId]: { status: "Polling error - check console", summary: "" },
        }));
        setIsScanning((prev) => ({ ...prev, [repoId]: false }));
        polling = false;
      }
    }

    if (pollAttempts >= maxPollAttempts) {
      setScanStatus((prev) => ({
        ...prev,
        [repoId]: { status: "Scan timeout - still processing", summary: "" },
      }));
      setIsScanning((prev) => ({ ...prev, [repoId]: false }));
    }
  };

  // ✅ NEW: Cancel scan function
  const cancelScan = async (repo: GithubRepo) => {
    if (!token || !scanStatus[repo.id]?.scan_id) return;

    setIsCancelling((prev) => ({ ...prev, [repo.id]: true }));

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/scanner/scans/${scanStatus[repo.id].scan_id}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel scan");
      }

      const data = await response.json();
      setScanStatus((prev) => ({
        ...prev,
        [repo.id]: {
          status: "cancelled",
          summary: "Scan cancelled by user",
          scan_id: scanStatus[repo.id].scan_id,
        },
      }));
      setIsScanning((prev) => ({ ...prev, [repo.id]: false }));
    } catch (err: any) {
      console.error("Cancel error:", err);
      setScanStatus((prev) => ({
        ...prev,
        [repo.id]: { ...scanStatus[repo.id], summary: "Failed to cancel scan" },
      }));
    } finally {
      setIsCancelling((prev) => ({ ...prev, [repo.id]: false }));
    }
  };

  const handleOpenModal = (repo: GithubRepo) => {
    setSelectedRepoForModal(repo);
    setIsModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === "failed" || status === "error") return <AlertCircle className="w-4 h-4 text-red-400" />;
    if (status === "cancelled") return <XCircle className="w-4 h-4 text-gray-400" />;
    return <Loader className="w-4 h-4 text-yellow-400 animate-spin" />;
  };

  const getStatusBgColor = (status: string) => {
    if (status === "completed") return "bg-green-900/30 border-green-700";
    if (status === "failed" || status === "error") return "bg-red-900/30 border-red-700";
    if (status === "cancelled") return "bg-gray-900/30 border-gray-600";
    return "bg-yellow-900/30 border-yellow-700";
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-300">
          ⚠️ Please log in to view repositories
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🔐 GitHub Repositories</h1>
        <p className="text-gray-400">Security scan and vulnerability assessment for your connected repositories</p>
      </div>

      {/* Repository Cards Grid */}
      {repos.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-gray-600 hover:shadow-lg transition-all duration-200"
            >
              {/* Repository Header */}
              <div className="mb-5 pb-4 border-b border-gray-700">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold text-lg transition-colors group flex items-center gap-2"
                  >
                    {repo.full_name}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                  {repo.description || "No description provided"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-block text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-colors">
                    {repo.private ? "🔒 Private" : "🌐 Public"}
                  </span>
                </div>
              </div>

              {/* Scan Status Section */}
              <div className={`rounded-lg p-4 mb-5 border ${
                scanStatus[repo.id]?.status 
                  ? getStatusBgColor(scanStatus[repo.id].status)
                  : 'bg-gray-900/50 border-gray-700'
              }`}>
                {scanStatus[repo.id]?.status ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(scanStatus[repo.id].status)}
                      <span className="text-sm font-semibold text-gray-300 capitalize">
                        {scanStatus[repo.id].status.replace(/_/g, " ")}
                      </span>
                    </div>

                    {scanStatus[repo.id]?.summary && (
                      <ScanSummaryPreview
                        summary={scanStatus[repo.id].summary!}
                        onSeeMore={() => handleOpenModal(repo)}
                        maxLines={3}
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">📊 No scan performed yet. Click "Scan Repository" to begin.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
                  onClick={() => triggerScan(repo)}
                  disabled={!!isScanning[repo.id]}
                >
                  {isScanning[repo.id] ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      🔍 Scan
                    </>
                  )}
                </button>

                {/* ✅ NEW: Cancel Button - Only show while scanning */}
                {isScanning[repo.id] && (
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
                    onClick={() => cancelScan(repo)}
                    disabled={isCancelling[repo.id]}
                  >
                    {isCancelling[repo.id] ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        ⏹️ Stop
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-gray-400 mb-4">No repositories connected yet</p>
          <a
            href="https://github.com/settings/connections/applications"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors underline"
          >
            Connect your GitHub account
          </a>
        </div>
      )}

      {/* Modal for Full Scan Results */}
      <ScanResultsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRepoForModal(null);
        }}
        repoName={selectedRepoForModal?.name || ""}
        summary={scanStatus[selectedRepoForModal?.id!]?.summary || ""}
        status={scanStatus[selectedRepoForModal?.id!]?.status || ""}
      />
    </div>
  );
};

export default GithubRepoList;

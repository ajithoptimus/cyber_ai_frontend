import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  description?: string;
}

const GithubRepoList: React.FC = () => {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<{ [repoId: number]: string }>({});
  const { token } = useAuth();

  console.log("TOKEN IN USE:", token);


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

    fetchRepos();
  }, [token]);

  // Scan trigger logic
  const triggerScan = async (repo: GithubRepo) => {
    setScanStatus((prev) => ({ ...prev, [repo.id]: "Starting..." }));

    try {
      const response = await fetch("http://localhost:8000/api/v1/scans/start", {
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
      setScanStatus((prev) => ({ ...prev, [repo.id]: `Scan started! ID: ${scan_id}` }));

      // TODO: Optional - add scan status polling with scan_id
    } catch (err: any) {
      setScanStatus((prev) => ({ ...prev, [repo.id]: "Scan failed!" }));
    }
  };

  if (loading) return <div>Loading repositories...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your GitHub Repositories</h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Visibility</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repo) => (
            <tr key={repo.id} className="border-t">
              <td className="py-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {repo.full_name}
                </a>
                <div className="text-sm text-gray-500">{repo.description}</div>
              </td>
              <td className="py-2">{repo.private ? "Private" : "Public"}</td>
              <td className="py-2">
                <button
                  className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                  onClick={() => triggerScan(repo)}
                >
                  Scan
                </button>
                <div className="text-sm text-gray-400 min-h-5">
                  {scanStatus[repo.id]}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GithubRepoList;

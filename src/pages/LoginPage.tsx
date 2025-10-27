import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/'); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/login/github';
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/login/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
        <p className="text-gray-400 mb-6">Sign in to access premium features</p>

        {error && (
          <div className="px-4 py-3 mb-4 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-200 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 text-sm text-gray-400 text-center">or</div>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded transition-colors my-2"
        >
          {/* Google SVG Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <g>
              <path fill="#fff" d="M21.6 12.227c0-.682-.061-1.355-.174-2.003H12v3.775h5.431a4.603 4.603 0 0 1-1.995 3.019v2.5h3.222c1.883-1.735 2.942-4.291 2.942-7.291z"/>
              <path fill="#fff" d="M12 22c2.43 0 4.466-.805 5.954-2.188l-3.222-2.5c-.894.6-2.036.954-3.252.954-2.5 0-4.615-1.69-5.377-3.974H2.805v2.548A9.997 9.997 0 0 0 12 22z"/>
              <path fill="#fff" d="M6.623 13.291a5.987 5.987 0 0 1 0-3.582V7.16H2.805A10 10 0 0 0 2 12c0 1.579.378 3.073 1.057 4.394L6.623 13.29z"/>
              <path fill="#fff" d="M12 6.545c1.32 0 2.497.454 3.428 1.342l2.571-2.571C16.461 3.608 14.425 2.727 12 2.727 7.655 2.727 3.977 5.386 2.805 7.159l3.818 2.549C7.383 8.233 9.52 6.545 12 6.545z"/>
            </g>
          </svg>
          <span>Continue with Google</span>
        </button>
        <button
          onClick={handleGitHubLogin}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors my-2"
        >
          {/* Place GitHub SVG here if you like */}
          <span>Continue with GitHub</span>
        </button>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/signup" className="text-teal-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

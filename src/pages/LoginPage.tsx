import React from 'react';

const LoginPage: React.FC = () => {
  // This URL must match the one your backend (routes/auth.py) is configured for
  const GITHUB_LOGIN_URL = '/api/v1/auth/login/github';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-6">AI Security Scanner</h1>
        <p className="text-gray-400 mb-8">Please log in to continue.</p>
        <a
          href={GITHUB_LOGIN_URL}
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Login with GitHub
        </a>
      </div>
    </div>
  );
};

export default LoginPage;

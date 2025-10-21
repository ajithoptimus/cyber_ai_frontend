import React from 'react';

const LoginPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="bg-gray-800 rounded-lg p-8 shadow text-center w-full max-w-lg">
      <h1 className="text-4xl font-bold text-white mb-6">Welcome to Cyber.AI</h1>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-xl font-semibold"
        onClick={() => {
          window.location.href = 'http://localhost:8000/api/v1/auth/login/github';
        }}
      >
        Sign in with GitHub
      </button>
    </div>
  </div>
);

export default LoginPage;

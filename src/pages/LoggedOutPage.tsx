import React from 'react';

const LoggedOutPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <h1 className="text-2xl font-bold mb-4">You have been logged out of NexaSecure.ai</h1>
    <p className="mb-8 text-gray-400">
      If you also want to log out of your GitHub account,{' '}
      <a
        href="https://github.com/logout"
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-400 hover:underline"
      >
        click here
      </a>
      .
    </p>
    <a
      href="/login"
      className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow text-lg"
    >
      Return to Login
    </a>
  </div>
);

export default LoggedOutPage;

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage: React.FC = () => {
  const { setAuthToken } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run once on component mount
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth Error:', error);
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      setAuthToken(token);
      // Redirect to dashboard
      navigate('/threat-intelligence', { replace: true });
    } else {
      // No token found, redirect to login
      console.warn('Invalid access to callback page - no token found.');
      navigate('/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- Only on mount (prevents infinite loop)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <div className="mb-4">
          <svg 
            className="animate-spin h-12 w-12 mx-auto text-teal-500" 
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
        </div>
        <h2 className="text-2xl font-semibold mb-2">Finalizing Login...</h2>
        <p className="text-gray-400">Please wait, you are being redirected.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;

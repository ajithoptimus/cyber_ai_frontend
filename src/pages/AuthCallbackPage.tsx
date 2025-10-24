import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage: React.FC = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // --- THIS IS THE FIX ---
    // We are now looking for 'token' in the URL, not 'code'
    const token = searchParams.get('token');
    // --- END OF FIX ---

    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth Error:', error);
      navigate('/login'); // Redirect to login on error
      return;
    }

    if (token) {
      // We found the token!
      // 1. Set it in our context (which also saves to localStorage)
      login(token);
      
      // 2. Redirect to the main app (dashboard)
      navigate('/');
    } else {
      // This page was loaded without a token or error
      console.warn('Invalid access to callback page.');
      navigate('/login');
    }

    // We only want this to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, login, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Finalizing Login...</h2>
        <p>Please wait, you are being redirected.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
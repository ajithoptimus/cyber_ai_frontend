import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Go up one level to find /contexts

const AuthCallbackPage: React.FC = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('GitHub OAuth Error:', error);
      navigate('/login'); // Redirect to login on error
      return;
    }

    if (code) {
      const handleLogin = async () => {
        try {
          // This function now calls your backend
          await login(code);
          // On success, redirect to the main app (dashboard)
          navigate('/'); 
        } catch (err) {
          console.error('Login failed:', err);
          // On failure, redirect back to login page
          navigate('/login');
        }
      };

      handleLogin();
    } else {
      // No code, no error - invalid access
      console.warn('Invalid access to callback page.');
      navigate('/login');
    }

    // We only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, login, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Processing Login</h2>
        <p>Please wait while we authenticate your GitHub account...</p>
        {/* You could add a spinner here */}
      </div>
    </div>
  );
};

export default AuthCallbackPage;

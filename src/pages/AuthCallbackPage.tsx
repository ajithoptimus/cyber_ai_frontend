import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
      Authenticating...
    </div>
  );
};

export default AuthCallbackPage;

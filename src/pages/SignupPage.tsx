import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password, username || undefined);
      navigate('/'); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--color-background)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '32px',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h1 style={{ 
          fontSize: 'var(--font-size-3xl)', 
          fontWeight: 'var(--font-weight-bold)',
          marginBottom: '8px',
          color: 'var(--color-text)'
        }}>
          Create Account
        </h1>
        
        <p style={{ 
          color: 'var(--color-text-secondary)', 
          marginBottom: '24px' 
        }}>
          Get started with Cyber.AI
        </p>

        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: 'rgba(var(--color-error-rgb), 0.1)',
            border: '1px solid var(--color-error)',
            borderRadius: 'var(--radius-base)',
            color: 'var(--color-error)',
            fontSize: 'var(--font-size-sm)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text)'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 'var(--font-size-base)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-base)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text)'
            }}>
              Username (optional)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 'var(--font-size-base)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-base)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text)'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 'var(--font-size-base)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-base)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary btn--full-width"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ 
          textAlign: 'center',
          marginTop: '24px',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)'
        }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={{ 
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;


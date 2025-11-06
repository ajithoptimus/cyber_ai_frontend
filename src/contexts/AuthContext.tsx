import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode
} from 'react';

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username?: string) => Promise<void>;
  setAuthToken: (newToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost:8000/api/v1';

  // Decode JWT to get user info
  const decodeToken = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        username: payload.username
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Check localStorage for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      const userData = decodeToken(storedToken);
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  // Signup
  const signup = async (email: string, password: string, username?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }

      const data = await response.json();
      const newToken = data.access_token;
      localStorage.setItem('accessToken', newToken);
      setToken(newToken);
      const userData = decodeToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      const newToken = data.access_token;
      localStorage.setItem('accessToken', newToken);
      setToken(newToken);
      const userData = decodeToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Manual token setter (OAuth callback)
  const setAuthToken = (newToken: string) => {
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
    const userData = decodeToken(newToken);
    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
    window.location.href = '/logged-out';
  };

  const isLoggedIn = !!token;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading session...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        login,
        signup,
        setAuthToken,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

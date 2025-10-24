import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode
} from 'react';

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  /**
   * Sets the new token in state and localStorage.
   */
  login: (newToken: string) => void;
  /**
   * Logs the user out.
   */
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false); // Finished checking
  }, []);

  // --- THIS IS THE UPDATED FUNCTION ---
  // It's now very simple. It just sets the token.
  const login = (newToken: string) => {
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    // Redirect to login page to prevent being stuck on a protected route
    window.location.href = '/login';
  };

  const isLoggedIn = !!token;

  // Don't render children until we've checked for the token
  if (isLoading) {
    // This will now be styled because of Step 1
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading session...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode // Fix: 'type' keyword added
} from 'react';

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  /**
   * Exchanges a GitHub auth code for a JWT token by calling the backend.
   */
  login: (code: string) => Promise<void>;
  /**
   * Logs the user out by clearing the token from state and localStorage.
   */
  logout: () => void;
  isLoading: boolean; // For checking token on initial load
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // Check localStorage for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false); // Finished checking
  }, []);

  // Internal function to set token in state and storage
  const setTokenInStateAndStorage = (newToken: string) => {
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
  };

  // --- NEW LOGIN FUNCTION ---
  // This function is called from the AuthCallbackPage.
  // It takes the code, sends it to the backend, gets a token,
  // and then sets the token in state/storage.
  const login = async (code: string) => {
    try {
      // Call your backend callback endpoint
      const response = await fetch('/api/v1/auth/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'GitHub login failed');
      }

      // Assuming your backend returns { token: "your_jwt_token" }
      const data = await response.json();
      
      if (!data.token) {
         throw new Error('No token received from server');
      }
      
      setTokenInStateAndStorage(data.token);
      
    } catch (error) {
      console.error('Failed to login:', error);
      // Clear any partial state just in case
      logout(); 
      // Re-throw error so the calling component (AuthCallbackPage) can handle it
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    // Redirect to login page to prevent being stuck on a protected route
    // Using window.location.href ensures a full refresh and state clear
    window.location.href = '/login';
  };

  const isLoggedIn = !!token;

  // Don't render children until we've checked for the token
  if (isLoading) {
    // You can replace this with a proper loading spinner component
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

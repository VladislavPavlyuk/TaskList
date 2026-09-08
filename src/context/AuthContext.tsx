import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TokenType} from '../types/TokensType';
import {loginAPI, setAuthTokens, setOnAuthFailure} from '../api/tasksApi';

interface AuthContextType {
  accessToken: string | null;
  tokenLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  const logout = async () => {
    await AsyncStorage.removeMany(['accessToken', 'refreshToken']);
    setAuthTokens(null, null);
    setAccessToken(null);
  };

  useEffect(() => {
    const loadToken = async () => {
      try {
        const [access, refresh] = await Promise.all([
          AsyncStorage.getItem('accessToken'),
          AsyncStorage.getItem('refreshToken'),
        ]);
        setAuthTokens(access, refresh);
        setAccessToken(access);
      } catch (error) {
        console.log(error);
      } finally {
        setTokenLoading(false);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    setOnAuthFailure(() => {
      void logout();
    });
    return () => setOnAuthFailure(null);
  }, []);

  const login = async (username: string, password: string) => {
    const tokens: TokenType = await loginAPI(username, password);
    await AsyncStorage.setItem('accessToken', tokens.access);
    await AsyncStorage.setItem('refreshToken', tokens.refresh);
    setAuthTokens(tokens.access, tokens.refresh);
    setAccessToken(tokens.access);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        tokenLoading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

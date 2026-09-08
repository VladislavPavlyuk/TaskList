import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenType } from '../types/TokensType.ts';
import { loginAPI } from '../api/tasksApi.ts';

interface AuthContextType{
  accessToken: string;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<void>;
  logout:() => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = React.useState(true);
  useEffect(() => {
    const loadToken = async ()=>{
      try {
        const token = await AsyncStorage.getItem('accessToken');
        setAccessToken(token);
      }catch(error){
        console.log(error);
      }finally {
        setTokenLoading(false);
      }
    };
    loadToken();
  },[]);

  const login=
    (username: string, password: string) =>{
      const tokens: TokenType = await loginAPI(username, password);
      await AsyncStorage.setItem('accessToken',tokens.access);
      await AsyncStorage.setItem('refreshToken',tokens.refresh);
      setAccessToken(tokens.access);
    }

    const logout=
      async () => {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setAccessToken(null);
    }

    return (
      <AuthContext.Provider
        value={{
          accessToken,
          tokenLoading,
          login,
          logout
        }}
      >
        {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
}
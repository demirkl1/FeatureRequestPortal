import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { login as loginRequest, logout as logoutTokens } from '../api/auth';
import { apiGet, setUnauthorizedHandler } from '../api/http';
import type { ApplicationConfigurationDto, CurrentUserDto } from '../api/types';

const ANONYMOUS_USER: CurrentUserDto = {
  isAuthenticated: false,
  userName: null,
  name: null,
  roles: [],
};

interface AuthContextValue {
  currentUser: CurrentUserDto;
  grantedPolicies: Record<string, boolean>;
  /** True while the initial application-configuration bootstrap is in flight. */
  isLoading: boolean;
  hasPolicy: (policy: string) => boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUserDto>(ANONYMOUS_USER);
  const [grantedPolicies, setGrantedPolicies] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadConfiguration = useCallback(async () => {
    try {
      const config = await apiGet<ApplicationConfigurationDto>(
        '/api/abp/application-configuration?IncludeLocalizationResources=false',
      );
      setCurrentUser(config.currentUser);
      setGrantedPolicies(config.auth.grantedPolicies);
    } catch {
      setCurrentUser(ANONYMOUS_USER);
      setGrantedPolicies({});
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setCurrentUser(ANONYMOUS_USER);
      setGrantedPolicies({});
    });

    void (async () => {
      setIsLoading(true);
      await loadConfiguration();
      setIsLoading(false);
    })();
  }, [loadConfiguration]);

  const login = useCallback(
    async (username: string, password: string) => {
      await loginRequest(username, password);
      await loadConfiguration();
    },
    [loadConfiguration],
  );

  const logout = useCallback(() => {
    logoutTokens();
    setCurrentUser(ANONYMOUS_USER);
    setGrantedPolicies({});
  }, []);

  const hasPolicy = useCallback(
    (policy: string) => grantedPolicies[policy] === true,
    [grantedPolicies],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ currentUser, grantedPolicies, isLoading, hasPolicy, login, logout }),
    [currentUser, grantedPolicies, isLoading, hasPolicy, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

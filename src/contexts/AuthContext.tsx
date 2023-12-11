'use client';

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';

import fetchAPI from '~/lib/fetch';

export type User = {
  id: number;
  name: string;
  email: string;
  roles: Array<'super-admin' | 'hq' | 'ops'>;
};

type AuthContextType =
  | {
      user?: User;
      isLoading: boolean;
      login: (_user: User, _token: string, _cb?: () => void) => void;
      logout: () => void;
    }
  | undefined;

const authContext = createContext<AuthContextType>(undefined);

export function useAuth() {
  const context = useContext(authContext);
  if (!context) {
    throw new Error('useAuth must be called withing AuthProvider.');
  }

  return context;
}

export const AuthProvider: React.FC<{
  children: ReactNode;
  auth?: User;
}> = ({ children, auth }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>();

  const JWT_TOKEN = localStorage.getItem('auth');

  const {
    isLoading: isFetching,
    error,
    mutate: mutateUser,
  } = useSWR<{ data: User }>(JWT_TOKEN && !user ? `/api/me` : undefined, {
    fallbackData: auth ? { data: auth } : undefined,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    onError: (error) => {
      // 403: unauthorized - expired/invalid token.
      if (error.status === 401) {
        localStorage.removeItem('auth');

        // clear cache
        mutate(() => true, undefined, { revalidate: false });

        setUser(undefined);
      }
    },
    onSuccess(res) {
      /**
       * using setUser to force consumers to re-Render
       */
      setUser({ ...res.data });
    },
  });

  // to avoid race conditions between isFetching and setUser
  useEffect(() => {
    if (!JWT_TOKEN) {
      setIsLoading(false);
    }

    if (!isFetching && (user || error)) {
      setIsLoading(false);
    }
  }, [isFetching, user, error, JWT_TOKEN]);

  const login = useCallback(
    (userResponse: User, token: string, cb?: () => void) => {
      localStorage.setItem('auth', token);

      mutateUser({ data: userResponse });
      setUser(userResponse);

      cb?.();
    },
    [mutateUser],
  );

  const logout = useCallback(() => {
    fetchAPI(`/api/logout`, {
      method: 'POST',
    }).then(() => {
      localStorage.removeItem('auth');

      // clear cache
      mutate(() => true, undefined, { revalidate: false });

      setUser(undefined);
      router.push('/login');
    });
  }, [router]);

  const value = useMemo(
    () => ({
      user: user,
      isLoading: isLoading,
      login,
      logout,
    }),
    [login, logout, user, isLoading],
  );

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

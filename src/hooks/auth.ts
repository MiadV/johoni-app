import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

import axios from '~/lib/axios';

type UseAuth = {
  middleware?: 'auth' | 'guest';
};

type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  roles: Array<'super-admin' | 'hq' | 'ops'>;
};

type Login = {
  email: string;
  password: string;
  remember?: boolean;
  setErrors: (_errors: any) => void;
};

export const useAuth = ({ middleware }: UseAuth) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR<User | undefined>(
    '/api/user',
    () =>
      axios
        .get('/api/user')
        .then((res) => res.data)
        .catch((error) => {
          if (error.response.status !== 409) throw error;
        }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  const login = async ({ setErrors, ...props }: Login) => {
    await csrf();

    setErrors([]);

    axios
      .post('/login', props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const logout = useCallback(async () => {
    if (!error) {
      await axios.post('/logout').then(() => mutate());
    }

    window.location.pathname = '/login';
  }, [error, mutate]);

  useEffect(() => {
    if (middleware === 'guest' && user) router.push('/');

    if (middleware === 'auth' && error) logout();
  }, [user, error, middleware, router, logout]);

  return {
    user,
    login,
    logout,
  };
};

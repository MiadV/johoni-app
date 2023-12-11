import { env } from '~/env.mjs';

type CustomErrorType = Error & {
  data?: unknown;
  status: number;
};

export default async function fetchAPI<T = any, P = any>(
  url: string = '',
  options: RequestInit & { data?: P; body?: any } = {},
): Promise<T> {
  const JWT_TOKEN = localStorage.getItem('auth');

  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...(JWT_TOKEN && { Authorization: `Bearer ${JWT_TOKEN}` }),
      ...options.headers,
    },
    ...(options.data
      ? { body: JSON.stringify(options.data) }
      : { body: options.body }),
  });

  if (!res.ok) {
    // 401: unauthorized - expired/invalid token
    if (res.status === 401) {
      // remove token
      localStorage.removeItem('auth');
      // redirect to login
      window.location.href = '/login';
    }

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    const error = new Error(
      `An error occurred while fetching the data. code: ${res.status}`,
    ) as CustomErrorType;
    // Attach extra info to the error object.
    error.data = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
}

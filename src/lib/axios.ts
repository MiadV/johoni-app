import { env } from '~/env.mjs';
import Axios from 'axios';

const axios = Axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
});

export default axios;

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

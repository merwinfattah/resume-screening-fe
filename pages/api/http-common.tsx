import axios from 'axios';
import { useSelector } from 'react-redux';

export const api = axios.create({
  baseURL: 'http://localhost:8010/proxy',
  headers: {
    'Content-type': 'application/json',
    'ngrok-skip-browser-warning': true,
  },
});

export const apiGet = axios.create({
  baseURL: 'http://localhost:8010/proxy',
  headers: {
    'ngrok-skip-browser-warning': true,
  },
});

export const ApiAuth = () => {
  const token = useSelector((state: any) => state.auth.token);

  // Set the token in the headers
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return api;
};

export const ApiAuthGet = () => {
  const token = useSelector((state: any) => state.auth.token);

  // Set the token in the headers
  apiGet.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return apiGet;
};

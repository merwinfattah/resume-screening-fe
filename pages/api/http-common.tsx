import axios from 'axios';
import { useSelector } from 'react-redux';

export const api = axios.create({
  // baseURL: 'https://c718-182-253-194-77.ngrok-free.app',
  baseURL: 'localhost:8010/proxy',
  headers: {
    'Content-type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export const ApiAuth = () => {
  const token = useSelector((state: any) => state.auth.token);

  // Set the token in the headers
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return api;
};

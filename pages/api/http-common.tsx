import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://ec2-3-87-22-2.compute-1.amazonaws.com:5000',
  headers: {
    'Content-type': 'application/json',
    'ngrok-skip-browser-warning': true,
  },
});

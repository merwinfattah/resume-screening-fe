import axios from 'axios';

export const apiGet = axios.create({
  baseURL: 'http://ec2-44-202-51-145.compute-1.amazonaws.com:5000',
  headers: {
    'ngrok-skip-browser-warning': true,
  },
});

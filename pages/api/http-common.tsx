import axios from 'axios';

const apiKey = process.env.API_URL_BACKEND;
export const api = axios.create({
  baseURL: 'http://localhost:8010/proxy',
  headers: {
    'Content-type': 'application/json',
    'ngrok-skip-browser-warning': true,
  },
});

export const ApiAuthForm = (token: any) => {
  const apiAuthFormWithToken = axios.create({
    baseURL: 'http://localhost:8010/proxy',
    headers: {
      'Content-type': 'multipart/form-data',
      'ngrok-skip-browser-warning': true,
      Authorization: token,
    },
  });

  return apiAuthFormWithToken;
};

export const apiGet = axios.create({
  baseURL: 'http://localhost:8010/proxy',
  headers: {
    'ngrok-skip-browser-warning': true,
  },
});

export const ApiAuth = (token: any) => {
  const apiAuthWithToken = axios.create({
    baseURL: 'http://localhost:8010/proxy',
    headers: {
      'Content-type': 'application/json',
      'ngrok-skip-browser-warning': true,
      Authorization: token,
    },
  });
  console.log('apiAuthWithToken', apiAuthWithToken);
  return apiAuthWithToken;
};

export const ApiAuthGet = (token: any) => {
  // Set the token in the headers
  const apiAuthGetWithToken = axios.create({
    baseURL: 'http://localhost:8010/proxy',
    headers: {
      'ngrok-skip-browser-warning': true,
      Authorization: token,
    },
  });

  return apiAuthGetWithToken;
};

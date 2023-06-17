import axios from 'axios';

const baseURL = 'http://ec2-44-202-51-145.compute-1.amazonaws.com:5000';

const commonHeaders = {
  'ngrok-skip-browser-warning': true,
};

export const api = axios.create({
  baseURL,
  headers: {
    'Content-type': 'application/json',
    ...commonHeaders,
  },
});

export const ApiAuthForm = (token: any) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-type': 'multipart/form-data',
      ...commonHeaders,
      Authorization: token,
    },
  });
};

export const apiGet = axios.create({
  baseURL,
  headers: commonHeaders,
});

export const ApiAuth = (token: any) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-type': 'application/json',
      ...commonHeaders,
      Authorization: token,
    },
  });
};

export const ApiAuthGet = (token: any) => {
  return axios.create({
    baseURL,
    headers: {
      ...commonHeaders,
      Authorization: token,
    },
  });
};

import axios from 'axios';

export const ApiAuthGet = (token: any) => {
  // Set the token in the headers
  const apiAuthGetWithToken = axios.create({
    baseURL: 'http://ec2-34-238-50-38.compute-1.amazonaws.com:5000',
    headers: {
      'ngrok-skip-browser-warning': true,
      Authorization: token,
    },
  });

  return apiAuthGetWithToken;
};

import axios from 'axios';

export const ApiAuth = (token: any) => {
  const apiAuthWithToken = axios.create({
    baseURL: 'http://ec2-44-202-51-145.compute-1.amazonaws.com:5000',
    headers: {
      'Content-type': 'application/json',
      'ngrok-skip-browser-warning': true,
      Authorization: token,
    },
  });
  console.log('apiAuthWithToken', apiAuthWithToken);
  return apiAuthWithToken;
};

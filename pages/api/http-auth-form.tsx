import axios from 'axios';

export const ApiAuthForm = (token: any) => {
  const apiAuthFormWithToken = axios.create({
    baseURL: 'http://ec2-34-238-50-38.compute-1.amazonaws.com:5000',
    headers: {
      'Content-type': 'multipart/form-data',
      'ngrok-skip-browser-warning': true,
      Authorization: token,
    },
  });

  return apiAuthFormWithToken;
};

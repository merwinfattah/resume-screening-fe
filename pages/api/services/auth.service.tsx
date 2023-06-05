import { api } from '../http-common';

const AuthDataService = {
  login(data: any) {
    return api.post('/api/auth/login', data);
  },
};

export default AuthDataService;

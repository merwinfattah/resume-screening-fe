import http from '../http-common';

const UserDataService = {
  create: () => {
    return http.get('/api/user/create-user');
  },
  get: (id: string) => {
    return http.get(`/api/user/get-user`, { params: { id } });
  },
};

export default UserDataService;

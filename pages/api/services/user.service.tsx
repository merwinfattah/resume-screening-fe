import { api, apiGet, ApiAuth } from '../http-common';

const UserDataService = {
  create(data: any) {
    return api.post('/api/user/create-user', data);
  },
  get(id: any) {
    return apiGet.get(`/api/user/get-user?id=${id}`);
  },
  edit(data: any, token: any) {
    return ApiAuth(token).put('/api/user/edit-user', data);
  },
  delete(data: any, token: any) {
    return ApiAuth(token).delete(`/api/user/delete-user`, { data });
  },
  changePassword(data: any, token: any) {
    return ApiAuth(token).put('/api/user/change-password', data);
  },
};

export default UserDataService;

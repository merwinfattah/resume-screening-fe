import { api, apiGet, ApiAuth } from '../http-common';

const UserDataService = {
  create(data: any) {
    return api.post('/api/user/create-user', data);
  },
  get(id: string) {
    return apiGet.get(`/api/user/get-user?id=${id}`);
  },
  edit(data: any) {
    return ApiAuth().put('/api/user/edit-user', data);
  },
  delete(data: any) {
    return ApiAuth().delete(`/api/user/delete-user`, data);
  },
  changePassword(data: any) {
    return ApiAuth().put('/api/user/change-password', data);
  },
};

export default UserDataService;

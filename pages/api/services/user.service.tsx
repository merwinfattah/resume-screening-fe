import { api, ApiAuth } from '../http-common';

const UserDataService = {
  create(data: any) {
    return api.post('/api/user/create-user', data);
  },
  get(id: string) {
    return api.get(`/api/user/get-user`, { params: { id } });
  },
  edit(data: JSON) {
    return ApiAuth().put('/api/user/edit-user', data);
  },
  delete(id: string) {
    return ApiAuth().delete(`/api/user/delete-user`, { params: { id } });
  },
  changePassword(data: JSON) {
    return ApiAuth().put('/api/user/change-password', data);
  },
};

export default UserDataService;

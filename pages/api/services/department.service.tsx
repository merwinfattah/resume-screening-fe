import { ApiAuth, ApiAuthGet } from '../http-common';

const DepartmentDataService = {
  create(data: any, token: any) {
    return ApiAuth(token).post('/api/department/create-department', data);
  },
  getAll(token: any) {
    return ApiAuthGet(token).get(`/api/department/get-all-department`);
  },
  get(id: string, token: any) {
    return ApiAuthGet(token).get(`/api/department/get-one-department?id=${id}`);
  },
  edit(data: any, token: any) {
    return ApiAuth(token).put('/api/department/edit-department', data);
  },
  delete(data: any, token: any) {
    return ApiAuth(token).delete(`/api/department/delete-department`, { data });
  },
};

export default DepartmentDataService;

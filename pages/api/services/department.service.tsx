import { ApiAuth, ApiAuthGet } from '../http-common';

const DepartmentDataService = {
  create(data: any) {
    return ApiAuth().post('/api/department/create-department', data);
  },
  getAll(id: string) {
    return ApiAuthGet().get(`/api/department/get-department?id=${id}`);
  },
  get(id: string) {
    return ApiAuthGet().get(`/api/department/get-one-department?id=${id}`);
  },
  edit(data: any) {
    return ApiAuth().put('/api/department/edit-department', data);
  },
  delete(data: any) {
    return ApiAuth().delete(`/api/department/delete-department`, data);
  },
};

export default DepartmentDataService;

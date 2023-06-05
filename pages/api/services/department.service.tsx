import { ApiAuth } from '../http-common';

const DepartmentDataService = {
  create(data: JSON) {
    return ApiAuth().post('/api/department/create-department', data);
  },
  getAll(id: string) {
    return ApiAuth().get(`/api/department/get-department`, { params: { id } });
  },
  get(id: string) {
    return ApiAuth().get(`/api/department/get-one-department`, { params: { id } });
  },
  edit(data: JSON) {
    return ApiAuth().put('/api/department/edit-department', data);
  },
  delete(id: string[]) {
    return ApiAuth().delete(`/api/department/delete-department`, { params: { id } });
  },
};

export default DepartmentDataService;

import { ApiAuth, ApiAuthGet } from '../http-common';

const PositionDataService = {
  create(data: any) {
    return ApiAuth().post('/api/position/create-position', data);
  },
  getAll(id: string) {
    return ApiAuthGet().get(`/api/position/get-position?id=${id}`);
  },
  get(id: string) {
    return ApiAuthGet().get(`/api/position/get-one-position?id=${id}`);
  },
  edit(data: any) {
    return ApiAuth().put('/api/position/edit-position', data);
  },
  editNumber(data: any) {
    return ApiAuth().put('/api/position/edit-position-candidates', data);
  },
  resolve(data: any) {
    return ApiAuth().put('/api/position/resolve-position', data);
  },
  remove(data: any) {
    return ApiAuth().put('/api/position/remove-position', data);
  },
  delete(data: any) {
    return ApiAuth().delete('/api/position/delete-position', data);
  },
};

export default PositionDataService;

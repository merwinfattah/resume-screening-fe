import { ApiAuth, ApiAuthGet } from '../http-common';

const PositionDataService = {
  create(data: any, token: any) {
    return ApiAuth(token).post('/api/position/create-position', data);
  },
  getAll(id: string, token: any) {
    return ApiAuthGet(token).get(`/api/position/get-position?companyId=${id}`);
  },
  get(id: string, token: any) {
    return ApiAuthGet(token).get(`/api/position/get-one-position?id=${id}`);
  },
  edit(data: any, token: any) {
    return ApiAuth(token).put('/api/position/edit-position', data);
  },
  editNumber(data: any, token: any) {
    return ApiAuth(token).put('/api/position/edit-position-candidates', data);
  },
  resolve(data: any, token: any) {
    return ApiAuth(token).put('/api/position/resolve-position', data);
  },
  remove(data: any, token: any) {
    return ApiAuth(token).put('/api/position/remove-position', data);
  },
  delete(data: any, token: any) {
    return ApiAuth(token).delete('/api/position/delete-position', { data });
  },
};

export default PositionDataService;

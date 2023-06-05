import { ApiAuth } from '../http-common';

const PositionDataService = {
  create(data: JSON) {
    return ApiAuth().post('/api/position/create-position', data);
  },
  getAll(id: string) {
    return ApiAuth().get(`/api/position/get-position`, { params: { id } });
  },
  get(id: string) {
    return ApiAuth().get(`/api/position/get-one-position`, { params: { id } });
  },
  edit(data: JSON) {
    return ApiAuth().put('/api/position/edit-position', data);
  },
  editNumber(data: JSON) {
    return ApiAuth().put('/api/position/edit-position-candidates', data);
  },
  resolve(data: JSON) {
    return ApiAuth().put('/api/position/resolve-position', data);
  },
  remove(data: JSON) {
    return ApiAuth().put('/api/position/remove-position', data);
  },
  delete(ids: string[]) {
    return ApiAuth().delete('/api/position/delete-position', { params: { ids } });
  },
};

export default PositionDataService;

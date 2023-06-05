import { api, ApiAuth } from '../http-common';

const CompanyDataService = {
  getAll() {
    return api.get('/api/company/get-all-company');
  },
  get(id: string) {
    return api.get(`/api/company/get-company`, { params: { id } });
  },
  create(data: JSON) {
    return api.post('/api/company/create-company', data);
  },
  edit(data: JSON) {
    return ApiAuth().put('/api/company/edit-company', data);
  },
  delete(id: string) {
    return ApiAuth().delete(`/api/company/delete-company`, { params: { id } });
  },
};

export default CompanyDataService;

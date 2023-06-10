import { api, apiGet, ApiAuth } from '../http-common';

const CompanyDataService = {
  getAll() {
    return apiGet.get('/api/company/get-all-company');
  },
  get(id: string) {
    return apiGet.get(`/api/company/get-one-company?id=${id}`);
  },
  create(data: any) {
    return api.post('/api/company/create-company', data);
  },
  edit(data: any, token: any) {
    return ApiAuth(token).put('/api/company/edit-company', data);
  },
  delete(data: any, token: any) {
    return ApiAuth(token).delete(`/api/company/delete-company`, { data });
  },
};

export default CompanyDataService;

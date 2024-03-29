import { ApiAuthGet } from './../http-auth-get';
import { ApiAuthForm } from './../http-auth-form';
import { ApiAuth } from './../http-auth';

const CandidateDataService = {
  get(id: string, token: any) {
    return ApiAuthGet(token).get(`/api/candidate/get-one-candidate?id=${id}`);
  },
  getAll(token: any) {
    return ApiAuthGet(token).get(`/api/candidate/get-all-candidate`);
  },
  edit(data: any, token: any) {
    return ApiAuth(token).put('/api/candidate/edit-candidate', data);
  },
  upload(data: any, token: any) {
    return ApiAuthForm(token).post('/api/candidate/create-candidate', data);
  },
  qualify(data: any, token: any) {
    return ApiAuth(token).put('/api/candidate/qualify-candidate', data);
  },
  delete(data: any, token: any) {
    return ApiAuth(token).delete('/api/candidate/delete-candidate', { data });
  },
};

export default CandidateDataService;

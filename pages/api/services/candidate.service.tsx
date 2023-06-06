import { ApiAuth, ApiAuthGet } from '../http-common';

const CandidateDataService = {
  get(id: string) {
    return ApiAuthGet().get(`/api/candidate/get-one-candidate?id=${id}`);
  },
  getAll(id: string) {
    return ApiAuthGet().get(`/api/candidate/get-candidate?id=${id}`);
  },
  edit(data: any) {
    return ApiAuth().put('/api/candidate/edit-candidate', data);
  },
  shortlist(data: any) {
    return ApiAuth().put('/api/candidate/shortlist-candidate', data);
  },
  qualify(data: any) {
    return ApiAuth().put('/api/candidate/qualify-candidate', data);
  },
  delete(data: any) {
    return ApiAuth().delete('/api/candidate/delete-candidate', data);
  },
};

export default CandidateDataService;

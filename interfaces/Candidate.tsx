export default interface Candidate {
  id: number;
  name: string;
  cv: File;
  email: string;
  domicile: string;
  competency: string;
  notes: string;
  score: number;
  isQualified: boolean;
  isShortlist: boolean;
  idPosition: number;
  createdDate: Date;
}

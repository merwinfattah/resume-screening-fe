export default interface Candidate {
  _id: string;
  __v: number;
  name: string;
  cvFile: string;
  email: string;
  domicile: string;
  score: number | null;
  isQualified: boolean;
  position: string;
  createdDate: Date;
}

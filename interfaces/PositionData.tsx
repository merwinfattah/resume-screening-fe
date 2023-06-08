interface IsTrash {
  isInTrash: boolean;
  removedDate: Date | undefined;
}

export default interface PositionData {
  _id: string;
  __v: number;
  department: string;
  name: string;
  education: string;
  location: string;
  description: string;
  qualification: string;
  minWorkExp: number;
  uploadedCV: number;
  filteredCV: number;
  qualifiedCandidates: number;
  isResolved: boolean;
  isTrash: IsTrash;
  createdDate: Date | undefined;
}

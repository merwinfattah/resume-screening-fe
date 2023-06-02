interface IsTrash {
  isInTrash: boolean;
  removedDate: Date | undefined;
}

export default interface PositionData {
  id: number;
  department: string;
  position: string;
  education: string;
  location: string;
  description: string;
  qualification: string;
  minimumExperience: string;
  uploadedCV: number;
  filteredCV: number;
  potentialCandidates: number;
  qualifiedCandidates: number;
  lastCandidatesUpdated: Date;
  isResolved: boolean;
  isTrash: IsTrash;
}

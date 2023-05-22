import  Candidate  from "./Candidate";

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
    minimumExperience: string;
    uploadedCV: string[];
    filteredCV: string[];
    potentialCandidates: Candidate[];
    qualifiedCandidates: Candidate[];
    lastCandidatesUpdated: Date;
    isResolved: boolean;
    isTrash: IsTrash;
  }
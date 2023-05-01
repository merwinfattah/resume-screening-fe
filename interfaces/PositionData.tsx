import  Candidate  from "./Candidate";

export default interface PositionData {
    department: string;
    position: string;
    education: string;
    location: string;
    description: string;
    minimumExperience: string;
    uploadedCV: File[];
    filteredCV: File[];
    potentialCandidates: Candidate[];
    qualifiedCandidates: Candidate[];
    lastCandidatesUpdated: Date;
    isResolved: boolean;
  }
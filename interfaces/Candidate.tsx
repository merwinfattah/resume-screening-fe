export default interface Candidate {
    name: string;
    cv: File | null;
    email: string;
    phone: string;
    domicile: string;
    competency: string;
    notes: string;
    score: number;
    isQualified: boolean;
    isFavorite: boolean;
    
}

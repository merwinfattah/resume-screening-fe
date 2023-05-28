export default interface Candidate {
    id: number;
    name: string;
    cv: string ;
    email: string;
    phone: string;
    domicile: string;
    competency: string;
    notes: string;
    score: number;
    isQualified: boolean;
    isFavorite: boolean;
    idPosition: number;
    createdDate: Date;
    
}

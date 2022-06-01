export interface MovieProps {
    _id?: string;
    title: string;
    releaseDate?: Date;
    numberOfReviews?: number;
    score?: number;
    directorName?: string;
    awardNominated?: boolean;
    latitude?: number;
    longitude?: number;
    webViewPath?: string;
}

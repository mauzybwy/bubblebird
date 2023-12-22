export type BaseReponse = {
    date: string;
    siteName: string;
};

export type SpeciesListItem = {
    comName: string;
    sciName: string;
};

export type OverviewStatsResponse = BaseReponse & {
    stats: {
        totalDetections: number;
        todaysDetections: number;
        lastHourDetections: number;
        speciesToday: SpeciesListItem[];
        speciesAllTime: SpeciesListItem[];
        chart: string;
    };
};

export type FlickrImageInfo = {
    thumbnail: string;
    thumbnailMed: string;
    url: string;
    flickrPage: string;
    username: string;
    license: {
        name: string;
        url: string;
    };
};

export type ResultItem = {
    comName: string;
    sciName: string;
    date: string;
    time: string;
    confidence: number;
    filename: string;
    image: FlickrImageInfo;
};

export type RecentsResponse = BaseReponse & {
    results: ResultItem[];
};

export type BirdsQuery = {
    startDate?: string;
    endDate?: string;
    limit?: number;
    speciesList?: string[];
};

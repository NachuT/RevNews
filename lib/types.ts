export interface NewsResult {
    title: string;
    url: string;
    source: string;
    age?: string;
    description?: string;
    thumbnail?: {
        src: string;
    };
}

export interface SearchResponse {
    results: NewsResult[];
}

export interface AIResponse {
    output: {
        content: {
            text: string;
        }[];
    }[];
}

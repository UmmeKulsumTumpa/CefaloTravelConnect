// DTOs for Post module
export interface CreatePostDto {
    title: string;
    total_cost?: number;
    total_duration?: number;
    effort_level?: 'Low' | 'Medium' | 'High';
    place_id?: string;
    categories?: string[];
    visibility?: 'Public' | 'Private' | 'Friends';
    description?: string;
}

export interface UpdatePostDto {
    title?: string;
    total_cost?: number;
    total_duration?: number;
    effort_level?: 'Low' | 'Medium' | 'High';
    place_id?: string;
    categories?: string[];
    visibility?: 'Public' | 'Private' | 'Friends';
    description?: string;
}

export interface AddPostServiceDto {
    post_id: string;
    service_id: string;
    cost?: number;
    rating?: number;
    visit_date?: string;
    notes?: string;
    recommended?: boolean;
}

export interface AddPostTransportDto {
    post_id: string;
    service_id: string;
    cost?: number;
    rating?: number;
    departure_time?: string;
    arrival_time?: string;
    latitude_from: number;
    longitude_from: number;
    address_from?: string;
    latitude_to: number;
    longitude_to: number;
    address_to?: string;
    notes?: string;
    recommended?: boolean;
}

export interface AddImageDto {
    post_id: string;
    url: string;
    caption?: string;
}

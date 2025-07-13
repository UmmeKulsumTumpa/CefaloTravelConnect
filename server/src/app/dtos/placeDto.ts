export interface PlaceFilters {
    name?: string;
    address?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
}

export interface PlaceDto {
    place_id?: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
    notes?: string;
    created_at?: Date;
}

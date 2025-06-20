import { GeolocationDto } from '../dtos/GeolocationDto.js';

export interface IGeolocationRepository {
    createGeolocation(data: GeolocationDto): Promise<GeolocationDto>;
    getGeolocationById(id: string): Promise<GeolocationDto | null>;
    updateGeolocation(id: string, data: Partial<GeolocationDto>): Promise<GeolocationDto | null>;
    deleteGeolocation(id: string): Promise<boolean>;
    listGeolocations(filter?: {
        lat?: number;
        lng?: number;
        radius?: number;
        address?: string;
        limit?: number;
        offset?: number;
    }): Promise<GeolocationDto[]>;
}

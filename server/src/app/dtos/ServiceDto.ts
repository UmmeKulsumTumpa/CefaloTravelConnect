export type ServiceType = 'Hotel' | 'Restaurant' | 'Attraction' | 'Transport';

export interface CreateServiceDto {
    name: string;
    type: ServiceType;
    latitude?: number;
    longitude?: number;
    address?: string;
    description?: string;
}

export interface UpdateServiceDto {
    name?: string;
    type?: ServiceType;
    latitude?: number;
    longitude?: number;
    address?: string;
    description?: string;
}

export interface ServiceResponseDto {
    service_id: string;
    name: string;
    type: ServiceType;
    latitude?: number;
    longitude?: number;
    address?: string;
    description?: string;
    created_at: string;
}

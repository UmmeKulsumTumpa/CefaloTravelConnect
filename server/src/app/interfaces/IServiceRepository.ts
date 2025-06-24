import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from '../dtos/ServiceDto.js';

export interface ServiceEntity {
    service_id: string;
    name: string;
    type: 'Hotel' | 'Restaurant' | 'Attraction' | 'Transport';
    latitude?: string;
    longitude?: string;
    address?: string;
    description?: string;
    created_at: string;
}

export interface ServiceCreateDB {
    name: string;
    type: 'Hotel' | 'Restaurant' | 'Attraction' | 'Transport';
    latitude?: number;
    longitude?: number;
    address?: string;
    description?: string;
}

export interface ServiceUpdateDB {
    name?: string;
    type?: 'Hotel' | 'Restaurant' | 'Attraction' | 'Transport';
    latitude?: number;
    longitude?: number;
    address?: string;
    description?: string;
}

export interface ServiceFilter {
    name?: string;
    type?: 'Hotel' | 'Restaurant' | 'Attraction' | 'Transport';
    latitude?: number;
    longitude?: number;
    address?: string;
}


export interface IServiceRepository {
    create(service: CreateServiceDto): Promise<ServiceResponseDto>;
    findById(service_id: string): Promise<ServiceResponseDto | undefined>;
    findAll(filters?: Partial<ServiceResponseDto>): Promise<ServiceResponseDto[]>;
    update(service_id: string, data: UpdateServiceDto): Promise<ServiceResponseDto | undefined>;
    delete(service_id: string): Promise<number>;
}

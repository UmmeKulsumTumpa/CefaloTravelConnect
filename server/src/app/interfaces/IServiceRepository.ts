import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from '../dtos/ServiceDto.js';

export interface IServiceRepository {
    create(service: CreateServiceDto): Promise<ServiceResponseDto>;
    findById(service_id: string): Promise<ServiceResponseDto | undefined>;
    findAll(filters?: Partial<ServiceResponseDto>): Promise<ServiceResponseDto[]>;
    update(service_id: string, data: UpdateServiceDto): Promise<ServiceResponseDto | undefined>;
    delete(service_id: string): Promise<number>;
}

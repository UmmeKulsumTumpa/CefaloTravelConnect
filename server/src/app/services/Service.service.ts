import { ServiceRepository } from '../repositories/Service.repository.js';
import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from '../dtos/ServiceDto.js';

export class ServiceService {
    private serviceRepository: ServiceRepository;
    constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    async createService(dto: CreateServiceDto): Promise<ServiceResponseDto> {
        return this.serviceRepository.create(dto);
    }

    async getServiceById(service_id: string): Promise<ServiceResponseDto | undefined> {
        return this.serviceRepository.findById(service_id);
    }

    async updateService(service_id: string, dto: UpdateServiceDto): Promise<ServiceResponseDto | undefined> {
        return this.serviceRepository.update(service_id, dto);
    }

    async deleteService(service_id: string): Promise<number> {
        return this.serviceRepository.delete(service_id);
    }

    async getAll(filters: Partial<ServiceResponseDto> = {}): Promise<ServiceResponseDto[]> {
        return this.serviceRepository.findAll(filters);
    }
}

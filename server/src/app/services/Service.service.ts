import { ServiceRepository } from '../repositories/Service.repository.js';
import { ServiceCreateRequestDto, ServiceUpdateRequestDto, ServiceResponseDto } from '../dtos/ServiceDto.js';
import { TransportService } from './Transport.service.js';
import { validateService, validateServiceUpdate } from '../validations/Service.validation.js';
import { validateCreateTransport, validateUpdateTransport } from '../validations/transport.validation.js';
import { AppError } from '../middlewares/error.middleware.js';

export class ServiceService {
    constructor(
        private serviceRepository: ServiceRepository,
        private transportService: TransportService
    ) {}

    async createService(data: ServiceCreateRequestDto): Promise<ServiceResponseDto> {
        const validation = validateService(data);
        if (!validation.valid) throw new AppError(validation.errors.join(', '), 400);

        let service: ServiceResponseDto | undefined;
        if (data.type === 'Transport' && data.transport) {
            const transportValidation = validateCreateTransport({ ...data.transport, service_id: '' });
            if (transportValidation.length) throw new AppError(transportValidation.join(', '), 400);
            const transport = await this.transportService.createTransport(data.transport, data);
            service = await this.serviceRepository.findById(transport.service_id);
        } else {
            const created = await this.serviceRepository.create(data);
            service = await this.serviceRepository.findById(created.service_id);
        }
        if (!service) throw new AppError('Failed to create service', 500);
        
        if (service.type === 'Transport') {
            const transport = await this.transportService.getTransportById(service.service_id);
            return { ...service, transport };
        }
        return service;
    }

    async getServiceById(service_id: string): Promise<ServiceResponseDto | undefined> {
        const service = await this.serviceRepository.findById(service_id);
        if (!service) throw new AppError('Service not found', 404);
        if (service.type === 'Transport') {
            const transport = await this.transportService.getTransportById(service_id);
            return { ...service, transport };
        }
        return service;
    }

    async updateService(service_id: string, data: ServiceUpdateRequestDto): Promise<ServiceResponseDto | undefined> {
        const service = await this.serviceRepository.findById(service_id);
        if (!service) throw new AppError('Service not found', 404);

        const validation = validateServiceUpdate(data);
        if (!validation.valid) throw new AppError(validation.errors.join(', '), 400);

        if (service.type === 'Transport' && data.transport) {
            const transportValidation = validateUpdateTransport(data.transport);
            if (transportValidation.length) throw new AppError(transportValidation.join(', '), 400);
            await this.transportService.updateTransport(service_id, data.transport);
        }
        const updated = await this.serviceRepository.update(service_id, data);
        if (!updated) throw new AppError('Failed to update service', 500);

        return this.getServiceById(service_id);
    }

    async deleteService(service_id: string): Promise<number> {
        const service = await this.serviceRepository.findById(service_id);
        if (!service) throw new AppError('Service not found', 404);
        if (service.type === 'Transport') {
            await this.transportService.deleteTransport(service_id);
        }
        const deleted = await this.serviceRepository.delete(service_id);
        if (!deleted) throw new AppError('Failed to delete service', 500);
        return deleted;
    }

    async getAll(filters: Partial<ServiceResponseDto> = {}): Promise<ServiceResponseDto[]> {
        const services = await this.serviceRepository.findAll(filters);

        const results: ServiceResponseDto[] = [];
        for (const service of services) {
            if (service.type === 'Transport') {
                const transport = await this.transportService.getTransportById(service.service_id);
                results.push({ ...service, transport });
            } else {
                results.push(service);
            }
        }
        return results;
    }
}

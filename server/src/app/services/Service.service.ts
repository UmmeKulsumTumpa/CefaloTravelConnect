import { ServiceRepository } from '../repositories/Service.repository.js';
import { ServiceCreateRequestDto, ServiceUpdateRequestDto, ServiceResponseDto } from '../dtos/ServiceDto.js';
import { ServiceCreateDB, ServiceUpdateDB, ServiceEntity, ServiceFilter } from '../interfaces/IServiceRepository.js';
import { TransportService } from './Transport.service.js';
import { validateService, validateServiceUpdate } from '../validations/Service.validation.js';
import { validateCreateTransport, validateUpdateTransport } from '../validations/transport.validation.js';
import { AppError } from '../middlewares/error.middleware.js';

export class ServiceService {
    constructor(
        private serviceRepository: ServiceRepository,
        private transportService: TransportService
    ) {}

    private toServiceResponseDto(service: ServiceEntity): ServiceResponseDto {
        return {
            ...service,
            latitude: service.latitude ? Number(service.latitude) : undefined,
            longitude: service.longitude ? Number(service.longitude) : undefined,
            created_at: service.created_at,
        };
    }

    async createService(data: ServiceCreateRequestDto): Promise<ServiceResponseDto> {
        const validation = validateService(data);
        if (!validation.valid) throw new AppError(validation.errors.join(', '), 400);

        // Remove transport before DB insert
        const { transport, ...serviceData } = data;
        const created = await this.serviceRepository.create(serviceData as ServiceCreateDB);
        let service = await this.serviceRepository.findById(created.service_id);
        if (!service) throw new AppError('Failed to create service', 500);
        let response = this.toServiceResponseDto(service);

        if (response.type === 'Transport' && transport) {
            const transportValidation = validateCreateTransport({ ...transport, service_id: response.service_id });
            if (transportValidation.length) throw new AppError(transportValidation.join(', '), 400);
            await this.transportService.createTransport({ ...transport, service_id: response.service_id });
            const transportDetails = await this.transportService.getTransportById(response.service_id);
            return { ...response, transport: transportDetails };
        }
        return response;
    }

    async getServiceById(service_id: string): Promise<ServiceResponseDto | undefined> {
        const service = await this.serviceRepository.findById(service_id);
        if (!service) throw new AppError('Service not found', 404);
        let response = this.toServiceResponseDto(service);
        if (response.type === 'Transport') {
            const transport = await this.transportService.getTransportById(service_id);
            return { ...response, transport };
        }
        return response;
    }

    async updateService(service_id: string, data: ServiceUpdateRequestDto): Promise<ServiceResponseDto | undefined> {
        const service = await this.serviceRepository.findById(service_id);
        if (!service) throw new AppError('Service not found', 404);
        const validation = validateServiceUpdate(data);
        if (!validation.valid) throw new AppError(validation.errors.join(', '), 400);
        const { transport, ...serviceData } = data;
        if (service.type === 'Transport' && transport) {
            const transportValidation = validateUpdateTransport(transport);
            if (transportValidation.length) throw new AppError(transportValidation.join(', '), 400);
            await this.transportService.updateTransport(service_id, transport);
        }
        const updated = await this.serviceRepository.update(service_id, serviceData as ServiceUpdateDB);
        if (!updated) throw new AppError('Failed to update service', 500);
        let response = this.toServiceResponseDto(updated);
        if (response.type === 'Transport') {
            const transportDetails = await this.transportService.getTransportById(service_id);
            return { ...response, transport: transportDetails };
        }
        return response;
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

    async getAll(filters: ServiceFilter = {}): Promise<ServiceResponseDto[]> {
        const services = await this.serviceRepository.findAll(filters);
        const results: ServiceResponseDto[] = [];
        for (const service of services) {
            let response = this.toServiceResponseDto(service);
            if (response.type === 'Transport') {
                const transport = await this.transportService.getTransportById(service.service_id);
                results.push({ ...response, transport });
            } else {
                results.push(response);
            }
        }
        return results;
    }
}

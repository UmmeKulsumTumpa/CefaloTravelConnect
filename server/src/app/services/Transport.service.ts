import { Transport, TransportCreateDto, TransportUpdateDto } from '../dtos/TransportDto.js';
import { CreateServiceDto } from '../dtos/ServiceDto.js';
import { ITransportRepository } from '../interfaces/ITransportRepository.js';
import { ServiceService } from './Service.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { validateCreateTransport, validateUpdateTransport } from '../validations/transport.validation.js';
import { validateService } from '../validations/Service.validation.js';

export class TransportService {
    constructor(private transportRepository: ITransportRepository,
        private serviceService: ServiceService
    ) { }

    async createTransport(data: TransportCreateDto, serviceData?: CreateServiceDto): Promise<Transport> {
        let service_id = data.service_id;

        if (!service_id) {
            if (!serviceData) {
                throw new AppError('Service ID or Service object is required', 400);
            }

            const validationResult = validateService(serviceData);
            if (!validationResult.valid) {
                throw new AppError(validationResult.errors.join(', '), 400);
            }

            // first create the service
            const service = await this.serviceService.createService({
                ...serviceData,
                type: 'Transport',
            });

            service_id = service.service_id;
        }

        const errors = validateCreateTransport(data);
        if (errors.length) throw new AppError(errors.join(', '), 400);

        // now can create the transport
        const transportData: TransportCreateDto = {
            ...data,
            service_id: service_id,
        };

        const transport = await this.transportRepository.createTransport(transportData);
        return transport;
    }

    async getTransportById(service_id: string): Promise<Transport> {
        const transport = await this.transportRepository.getTransportById(service_id);
        if (!transport) throw new AppError('Transport not found', 404);
        return transport;
    }

    async getAllTransports(): Promise<Transport[]> {
        return this.transportRepository.getAllTransports();
    }

    async updateTransport(service_id: string, data: TransportUpdateDto): Promise<Transport> {
        const errors = validateUpdateTransport(data);
        if (errors.length) throw new AppError(errors.join(', '), 400);
        const transport = await this.transportRepository.updateTransport(service_id, data);
        if (!transport) throw new AppError('Transport not found', 404);
        return transport;
    }

    async deleteTransport(service_id: string): Promise<boolean> {
        return this.transportRepository.deleteTransport(service_id);
    }

    async searchTransports(query: { mode?: string; operator?: string }): Promise<Transport[]> {
        return this.transportRepository.searchTransports(query);
    }
}

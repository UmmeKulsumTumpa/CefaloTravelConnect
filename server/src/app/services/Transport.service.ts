import { Transport, TransportCreateDto, TransportUpdateDto } from '../dtos/TransportDto.js';
import { ITransportRepository } from '../interfaces/ITransportRepository.js';
import { AppError } from '../middlewares/error.middleware.js';
import { validateCreateTransport, validateUpdateTransport } from '../validations/transport.validation.js';

export class TransportService {
    constructor(private transportRepository: ITransportRepository) {}

    async createTransport(data: TransportCreateDto): Promise<Transport> {
        if (!data.service_id) {
            throw new AppError('service_id is required to create a transport', 400);
        }

        const errors = validateCreateTransport(data);
        if (errors.length) throw new AppError(errors.join(', '), 400);

        const transport = await this.transportRepository.createTransport(data);

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

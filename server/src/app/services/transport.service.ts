import { Transport, TransportCreateDto, TransportUpdateDto } from '../dtos/index.js';
import { ITransportRepository } from '../interfaces/index.js';
import { AppError } from '../middlewares/index.js';
import { validateCreateTransport, validateUpdateTransport } from '../validations/index.js';

export class TransportService {
    constructor(private transportRepository: ITransportRepository) {}

    async createTransport(data: TransportCreateDto): Promise<Transport> {
        if (!data.service_id) {
            throw new AppError('service_id is required to create a transport', 400);
        }

        const existing = await this.getTransportIfExists(data.service_id);
        if (existing) {
            throw new AppError('A transport already exists for this service_id', 409);
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

    async getTransportIfExists(service_id: string): Promise<Transport | null> {
        try {
            return await this.getTransportById(service_id);
        } catch (e) {
            if (e instanceof AppError && e.message === 'Transport not found') {
                return null;
            }
            throw e;
        }
    }

    async getAllTransports(): Promise<Transport[]> {
        return this.transportRepository.getAllTransports();
    }

    async updateTransport(service_id: string, data: TransportUpdateDto): Promise<Transport> {
        const existing = await this.getTransportIfExists(service_id);
        if (!existing) throw new AppError('Transport not found', 404);

        const errors = validateUpdateTransport(data);
        if (errors.length) throw new AppError(errors.join(', '), 400);

        const transport = await this.transportRepository.updateTransport(service_id, data);
        if (!transport) throw new AppError('Transport not found', 404);
        return transport;
    }

    async deleteTransport(service_id: string): Promise<boolean> {
        const existing = await this.getTransportIfExists(service_id);
        if (!existing) throw new AppError('Transport not found', 404);
        return this.transportRepository.deleteTransport(service_id);
    }

    async searchTransports(query: { mode?: string; operator?: string }): Promise<Transport[]> {
        const transports = await this.transportRepository.searchTransports(query);
        if (!transports || transports.length === 0) {
            throw new AppError('No transports found for the given criteria', 404);
        }
        return transports;
    }
}

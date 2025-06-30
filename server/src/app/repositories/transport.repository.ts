import { Transport, TransportCreateDto, TransportUpdateDto } from '../dtos/transportDto.js';
import { ITransportRepository } from '../interfaces/transport.interface.js';
import { AppError } from '../middlewares/error.middleware.js';

export class TransportRepository implements ITransportRepository {
    constructor(private db: any) {}

    async createTransport(data: TransportCreateDto): Promise<Transport> {
        try {
            const [transport] = await this.db('transports').insert(data).returning('*');
            return transport;
        } catch (err) {
            throw new AppError('Failed to create transport', 500);
        }
    }

    async getTransportById(service_id: string): Promise<Transport | null> {
        try {
            const transport = await this.db('transports').where({ service_id }).first();
            return transport || null;
        } catch (err) {
            throw new AppError('Failed to fetch transport', 500);
        }
    }

    async getAllTransports(): Promise<Transport[]> {
        try {
            return await this.db('transports').orderBy('created_at', 'desc');
        } catch (err) {
            throw new AppError('Failed to fetch transports', 500);
        }
    }

    async updateTransport(service_id: string, data: TransportUpdateDto): Promise<Transport | null> {
        try {
            const [transport] = await this.db('transports').where({ service_id }).update(data).returning('*');
            return transport || null;
        } catch (err) {
            throw new AppError('Failed to update transport', 500);
        }
    }

    async deleteTransport(service_id: string): Promise<boolean> {
        try {
            const deleted = await this.db('transports').where({ service_id }).del();
            if (!deleted) throw new AppError('Transport not found', 404);
            return true;
        } catch (err) {
            throw new AppError('Failed to delete transport', 500);
        }
    }

    async searchTransports(query: { mode?: string; operator?: string }): Promise<Transport[]> {
        try {
            let q = this.db('transports');
            if (query.mode) q = q.where('mode', query.mode);
            if (query.operator) q = q.where('operator', query.operator);
            return await q.orderBy('created_at', 'desc');
        } catch (err) {
            throw new AppError('Failed to search transports', 500);
        }
    }
}

import { Transport, TransportCreateDto, TransportUpdateDto } from '../dtos/TransportDto.js';

export interface ITransportRepository {
    createTransport(data: TransportCreateDto): Promise<Transport>;
    getTransportById(service_id: string): Promise<Transport | null>;
    getAllTransports(): Promise<Transport[]>;
    updateTransport(service_id: string, data: TransportUpdateDto): Promise<Transport | null>;
    deleteTransport(service_id: string): Promise<boolean>;
    searchTransports(query: { mode?: string; operator?: string }): Promise<Transport[]>;
}

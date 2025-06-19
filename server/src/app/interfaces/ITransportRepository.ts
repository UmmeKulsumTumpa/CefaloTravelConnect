import type { TransportDto } from '../dtos/TransportDto.js';

export interface ITransportRepository {
	create(dto: TransportDto): Promise<string>;
	findById(transport_id: string): Promise<any>;
	findOrCreate(dto: TransportDto): Promise<string>;
}

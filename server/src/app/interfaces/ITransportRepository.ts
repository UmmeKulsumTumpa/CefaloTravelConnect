import type { TransportDto } from '../dtos/TransportDto.js';

export interface ITransportRepository {
	create(dto: TransportDto): Promise<number>;
	findById(transport_id: number): Promise<any>;
	findOrCreate(dto: TransportDto): Promise<number>;
}

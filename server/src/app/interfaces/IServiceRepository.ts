import type { ServiceDto } from '../dtos/ServiceDto.js';

export interface IServiceRepository {
	create(dto: ServiceDto): Promise<number>;
	findById(service_id: number): Promise<any>;
	findOrCreate(dto: ServiceDto): Promise<number>;
}

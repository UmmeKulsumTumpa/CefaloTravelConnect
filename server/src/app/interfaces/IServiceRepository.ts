import type { ServiceDto } from '../dtos/ServiceDto.js';

export interface IServiceRepository {
	create(dto: ServiceDto): Promise<string>;
	findById(service_id: string): Promise<any>;
	findOrCreate(dto: ServiceDto): Promise<string>;
}

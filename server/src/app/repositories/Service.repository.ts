import type { Knex } from 'knex';
import type { ServiceDto } from '../dtos/ServiceDto.js';
import type { IServiceRepository } from '../interfaces/IServiceRepository.js';

export class ServiceRepository implements IServiceRepository {
	constructor(private knex: Knex) { }

	async create(dto: ServiceDto): Promise<string> {
		const [id] = await this.knex('services').insert({
			name: dto.name,
			type: dto.type,
			geolocation_id: dto.geolocation_id,
			description: dto.description,
			created_at: this.knex.fn.now(),
		}).returning('service_id');
		return id.service_id || id;
	}

	async findById(service_id: string): Promise<any> {
		return this.knex('services').where({ service_id }).first();
	}

	async findOrCreate(dto: ServiceDto): Promise<string> {
		const existing = await this.knex('services')
			.where({ name: dto.name, type: dto.type })
			.first();
		if (existing) return existing.service_id;
		return this.create(dto);
	}
}

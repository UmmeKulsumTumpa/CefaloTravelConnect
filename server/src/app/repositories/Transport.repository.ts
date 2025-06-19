import type { Knex } from 'knex';
import type { TransportDto } from '../dtos/TransportDto.js';
import type { ITransportRepository } from '../interfaces/ITransportRepository.js';

export class TransportRepository implements ITransportRepository {
	constructor(private knex: Knex) { }

	async create(dto: TransportDto): Promise<string> {
		const [id] = await this.knex('transports').insert({
			name: dto.name,
			mode: dto.mode,
			geolocation_from_id: dto.geolocation_from_id,
			geolocation_to_id: dto.geolocation_to_id,
			operator: dto.operator,
			description: dto.description,
			created_at: this.knex.fn.now(),
		}).returning('transport_id');
		return id.transport_id || id;
	}

	async findById(transport_id: string): Promise<any> {
		return this.knex('transports').where({ transport_id }).first();
	}

	async findOrCreate(dto: TransportDto): Promise<string> {
		const existing = await this.knex('transports')
			.where({ name: dto.name, mode: dto.mode })
			.first();
		if (existing) return existing.transport_id;
		return this.create(dto);
	}
}

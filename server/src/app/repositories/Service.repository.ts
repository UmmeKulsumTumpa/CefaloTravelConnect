import { Knex } from 'knex';
import db from '../../db/db.js';
import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from '../dtos/ServiceDto.js';

export class ServiceRepository {
    private db: Knex;
    constructor(db: Knex) {
        this.db = db;
    }

    async create(service: CreateServiceDto): Promise<ServiceResponseDto> {
        const [created] = await this.db('services').insert(service).returning('*');
        return this.toServiceResponseDto(created);
    }

    async findById(service_id: string): Promise<ServiceResponseDto | undefined> {
        const service = await this.db('services').where({ service_id }).first();
        return service ? this.toServiceResponseDto(service) : undefined;
    }

    async update(service_id: string, data: UpdateServiceDto): Promise<ServiceResponseDto | undefined> {
        const [updated] = await this.db('services').where({ service_id }).update(data).returning('*');
        return updated ? this.toServiceResponseDto(updated) : undefined;
    }

    async delete(service_id: string): Promise<number> {
        return this.db('services').where({ service_id }).del();
    }

    async findAll(filters: Partial<ServiceResponseDto> = {}): Promise<ServiceResponseDto[]> {
        let query = this.db('services');
        if (filters.type) query = query.where('type', filters.type);
        if (filters.name) query = query.where('name', 'ilike', `%${filters.name}%`);
        if (filters.latitude) query = query.where('latitude', filters.latitude);
        if (filters.longitude) query = query.where('longitude', filters.longitude);
        if (filters.address) query = query.where('address', 'ilike', `%${filters.address}%`);
        const services = await query.orderBy('created_at', 'desc');
        return services.map(this.toServiceResponseDto);
    }

    private toServiceResponseDto(service: any): ServiceResponseDto {
        return {
            ...service,
            created_at: service.created_at instanceof Date ? service.created_at.toISOString() : service.created_at,
        };
    }
}

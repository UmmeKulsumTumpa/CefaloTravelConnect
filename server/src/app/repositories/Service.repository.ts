import { Knex } from 'knex';
import { ServiceCreateDB, ServiceUpdateDB, ServiceEntity, ServiceFilter } from '../interfaces/IServiceRepository.js';

export class ServiceRepository {
    private db: Knex;
    constructor(db: Knex) {
        this.db = db;
    }

    async create(service: ServiceCreateDB): Promise<ServiceEntity> {
        const [created] = await this.db('services').insert(service).returning('*');
        return created;
    }

    async findById(service_id: string): Promise<ServiceEntity | undefined> {
        const service = await this.db('services').where({ service_id }).first();
        return service || undefined;
    }

    async update(service_id: string, data: ServiceUpdateDB): Promise<ServiceEntity | undefined> {
        const [updated] = await this.db('services').where({ service_id }).update(data).returning('*');
        return updated || undefined;
    }

    async delete(service_id: string): Promise<number> {
        return this.db('services').where({ service_id }).del();
    }

    async findAll(filters: ServiceFilter = {}): Promise<ServiceEntity[]> {
        let query = this.db('services');
        if (filters.type) query = query.where('type', filters.type);
        if (filters.name) query = query.where('name', 'ilike', `%${filters.name}%`);
        if (filters.latitude) query = query.where('latitude', filters.latitude);
        if (filters.longitude) query = query.where('longitude', filters.longitude);
        if (filters.address) query = query.where('address', 'ilike', `%${filters.address}%`);
        return await query.orderBy('created_at', 'desc');
    }

    async findByIds(service_ids: string[]): Promise<ServiceEntity[]> {
        if (!service_ids.length) return [];
        return this.db('services').whereIn('service_id', service_ids).orderBy('created_at', 'desc');
    }

    async findNearby(lat: number, lng: number, radius: number): Promise<ServiceEntity[]> {
        return this.db('services')
            .whereRaw(
                `earth_distance(ll_to_earth(?, ?), ll_to_earth(latitude, longitude)) <= ?`,
                [lat, lng, radius]
            )
            .orderBy('created_at', 'desc');
    }
}

import type { Knex } from 'knex';
import type { PlaceDto, PlaceFilters } from '../dtos/index.js';
import type { IPlaceRepository } from '../interfaces/index.js';

export class PlaceRepository implements IPlaceRepository {
    constructor(private knex: Knex) { }

    async create(place: PlaceDto): Promise<PlaceDto> {
        const [created] = await this.knex('places').insert(place).returning('*');

        return created;
    }

    async findById(place_id: string): Promise<PlaceDto | null> {
        const place = await this.knex('places').where({ place_id }).first();
        return place || null;
    }

    async findAll(filters?: PlaceFilters): Promise<PlaceDto[]> {
        let query = this.knex('places').select('*');
        if (filters) {
            if (filters.name) {
                query = query.whereILike('name', `%${filters.name}%`);
            }
            if (filters.address) {
                query = query.whereILike('address', `%${filters.address}%`);
            }
            if (filters.notes) {
                query = query.whereILike('notes', `%${filters.notes}%`);
            }
            if (filters.latitude !== undefined) {
                query = query.where('latitude', filters.latitude);
            }
            if (filters.longitude !== undefined) {
                query = query.where('longitude', filters.longitude);
            }
        }
        return query;
    }

    async update(place_id: string, place: Partial<PlaceDto>): Promise<PlaceDto | null> {
        const [updated] = await this.knex('places').where({ place_id }).update(place).returning('*');
        return updated || null;
    }

    async delete(place_id: string): Promise<boolean> {
        const deleted = await this.knex('places').where({ place_id }).del();
        return deleted > 0;
    }
}

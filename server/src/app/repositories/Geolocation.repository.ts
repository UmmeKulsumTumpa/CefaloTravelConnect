import { GeolocationDto } from '../dtos/GeolocationDto.js';
import { IGeolocationRepository } from '../interfaces/IGeolocationRepository.js';
import db from '../../db/db.js';

export class GeolocationRepository implements IGeolocationRepository {
    async createGeolocation(data: GeolocationDto): Promise<GeolocationDto> {
        const [geo] = await db('geolocations').insert(data).returning('*');
        return geo;
    }

    async getGeolocationById(id: string): Promise<GeolocationDto | null> {
        const geo = await db('geolocations').where({ geolocation_id: id }).first();
        return geo || null;
    }

    async updateGeolocation(id: string, data: Partial<GeolocationDto>): Promise<GeolocationDto | null> {
        const [geo] = await db('geolocations').where({ geolocation_id: id }).update(data).returning('*');
        return geo || null;
    }

    async deleteGeolocation(id: string): Promise<boolean> {
        const deleted = await db('geolocations').where({ geolocation_id: id }).del();
        return deleted > 0;
    }

    async listGeolocations(filter?: {
        lat?: number;
        lng?: number;
        radius?: number;
        address?: string;
        limit?: number;
        offset?: number;
    }): Promise<GeolocationDto[]> {
        let query = db('geolocations');
        if (filter) {
            if (filter.address) {
                query = query.whereILike('address', `%${filter.address}%`);
            }
            if (filter.lat && filter.lng && filter.radius) {
                // Haversine formula for proximity search (in meters)
                query = query.whereRaw(`earth_distance(ll_to_earth(?, ?), ll_to_earth(latitude, longitude)) <= ?`, [filter.lat, filter.lng, filter.radius]);
            }
            if (filter.limit) query = query.limit(filter.limit);
            if (filter.offset) query = query.offset(filter.offset);
        }
        return await query;
    }
}

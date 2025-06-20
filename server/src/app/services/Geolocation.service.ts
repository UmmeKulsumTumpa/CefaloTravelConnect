import { GeolocationDto } from '../dtos/GeolocationDto.js';
import { IGeolocationRepository } from '../interfaces/IGeolocationRepository.js';
import { GeolocationRepository } from '../repositories/Geolocation.repository.js';
import { AppError } from '../errors/AppError.js';

export class GeolocationService {
    private repository: IGeolocationRepository;

    constructor(repository?: IGeolocationRepository) {
        this.repository = repository || new GeolocationRepository();
    }

    async createGeolocation(data: GeolocationDto): Promise<GeolocationDto> {
        // Validation: latitude [-90, 90], longitude [-180, 180]
        if (
            typeof data.latitude !== 'number' ||
            typeof data.longitude !== 'number' ||
            data.latitude < -90 ||
            data.latitude > 90 ||
            data.longitude < -180 ||
            data.longitude > 180
        ) {
            throw new AppError('Invalid latitude or longitude', 400);
        }
        try {
            return await this.repository.createGeolocation(data);
        } catch (error) {
            throw new AppError('Database error while creating geolocation', 500);
        }
    }

    async getGeolocationById(id: string): Promise<GeolocationDto | null> {
        if (!id) throw new AppError('Geolocation ID is required', 400);
        try {
            const geo = await this.repository.getGeolocationById(id);
            if (!geo) throw new AppError('Geolocation not found', 404);
            return geo;
        } catch (error) {
            throw new AppError('Database error while fetching geolocation', 500);
        }
    }

    async updateGeolocation(id: string, data: Partial<GeolocationDto>): Promise<GeolocationDto | null> {
        if (!id) throw new AppError('Geolocation ID is required', 400);
        if (data.latitude !== undefined && (data.latitude < -90 || data.latitude > 90)) {
            throw new AppError('Invalid latitude', 400);
        }
        if (data.longitude !== undefined && (data.longitude < -180 || data.longitude > 180)) {
            throw new AppError('Invalid longitude', 400);
        }
        try {
            const geo = await this.repository.updateGeolocation(id, data);
            if (!geo) throw new AppError('Geolocation not found', 404);
            return geo;
        } catch (error) {
            throw new AppError('Database error while updating geolocation', 500);
        }
    }

    async deleteGeolocation(id: string): Promise<boolean> {
        if (!id) throw new AppError('Geolocation ID is required', 400);
        try {
            const deleted = await this.repository.deleteGeolocation(id);
            if (!deleted) throw new AppError('Geolocation not found', 404);
            return deleted;
        } catch (error) {
            throw new AppError('Database error while deleting geolocation', 500);
        }
    }

    async listGeolocations(filter?: {
        lat?: number;
        lng?: number;
        radius?: number;
        address?: string;
        limit?: number;
        offset?: number;
    }): Promise<GeolocationDto[]> {
        if (filter) {
            if (filter.lat !== undefined && (filter.lat < -90 || filter.lat > 90)) {
                throw new AppError('Invalid filter latitude', 400);
            }
            if (filter.lng !== undefined && (filter.lng < -180 || filter.lng > 180)) {
                throw new AppError('Invalid filter longitude', 400);
            }
            if (filter.radius !== undefined && filter.radius <= 0) {
                throw new AppError('Radius must be positive', 400);
            }
        }
        try {
            return await this.repository.listGeolocations(filter);
        } catch (error) {
            throw new AppError('Database error while listing geolocations', 500);
        }
    }
}

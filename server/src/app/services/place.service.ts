import type { IPlaceRepository } from '../interfaces/index.js';
import type { PlaceDto } from '../dtos/index.js';

export class PlaceService {
    constructor(private placeRepository: IPlaceRepository) { }

    async createPlace(data: PlaceDto): Promise<PlaceDto> {
        return this.placeRepository.create(data);
    }

    async getPlaceById(place_id: string): Promise<PlaceDto | null> {
        return this.placeRepository.findById(place_id);
    }

    async getAllPlaces(filters?: { name?: string; address?: string; notes?: string; latitude?: number; longitude?: number }): Promise<PlaceDto[]> {
        return this.placeRepository.findAll(filters);
    }

    async updatePlace(place_id: string, data: Partial<PlaceDto>): Promise<PlaceDto | null> {
        return this.placeRepository.update(place_id, data);
    }

    async deletePlace(place_id: string): Promise<boolean> {
        return this.placeRepository.delete(place_id);
    }
}

import { PlaceDto, PlaceFilters } from '../dtos/placeDto.js';

export interface IPlaceRepository {
    create(place: PlaceDto): Promise<PlaceDto>;
    findById(place_id: string): Promise<PlaceDto | null>;
    findAll(filters?: PlaceFilters): Promise<PlaceDto[]>;
    update(place_id: string, place: Partial<PlaceDto>): Promise<PlaceDto | null>;
    delete(place_id: string): Promise<boolean>;
}

export interface TransportDto {
	name: string;
	mode: 'flight' | 'car' | 'rental' | 'bus' | 'train' | 'boat';
	geolocation_from_id?: number;
	geolocation_to_id?: number;
	operator?: string;
	description?: string;
}

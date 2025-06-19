export interface TransportDto {
	name: string;
	mode: 'flight' | 'car' | 'rental' | 'bus' | 'train' | 'boat';
	geolocation_from_id?: string;
	geolocation_to_id?: string;
	operator?: string;
	description?: string;
}

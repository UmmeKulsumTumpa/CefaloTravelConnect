export interface ServiceDto {
	name: string;
	type: 'hotel' | 'restaurant' | 'attraction';
	geolocation_id?: number;
	description?: string;
}

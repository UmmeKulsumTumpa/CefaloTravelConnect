export interface ServiceDto {
	name: string;
	type: 'hotel' | 'restaurant' | 'attraction';
	geolocation_id?: string;
	description?: string;
}

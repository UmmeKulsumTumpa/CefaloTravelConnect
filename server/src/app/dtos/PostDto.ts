import { ServiceDto } from './ServiceDto.js';
import { TransportDto } from './TransportDto.js';

export interface PostDto {
	user_id: number;
	title: string;
	total_cost?: number;
	total_duration?: number;
	effort_level?: 'low' | 'medium' | 'high';
	destination_id?: number;
	categories?: string[];
	visibility?: 'public' | 'private' | 'friends';
	images?: ImageDto[];
	post_services?: PostServiceDto[];
	post_transports?: PostTransportDto[];
}

export interface UpdatePostDto extends Partial<PostDto> { }

export interface PostServiceDto extends ServiceDto {
	service_id: number;
	cost?: number;
	rating?: number;
	visit_date?: string;
	notes?: string;
}

export interface PostTransportDto extends TransportDto {
	transport_id: number;
	cost?: number;
	rating?: number;
	departure_time?: string;
	arrival_time?: string;
	notes?: string;
}

export interface ImageDto {
	url: string;
	caption?: string;
}

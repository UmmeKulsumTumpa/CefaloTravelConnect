export interface TransportCreateDto {
    service_id: string;
    mode: string; 
    operator?: string;
}

export interface TransportUpdateDto {
    mode?: string;
    operator?: string;
}

export interface Transport {
    service_id: string;
    mode: string;
    operator?: string;
    created_at: string;
}

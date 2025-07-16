export interface CreateWishlistDto {
    place_id: string;
    name: string;
    region?: string;
    theme?: string;
    is_public?: boolean;
}

export interface UpdateWishlistDto {
    name?: string;
    region?: string;
    theme?: string;
    is_public?: boolean;
}

export interface WishlistResponseDto {
    wishlist_id: string;
    place_id: string;
    user_id: string;
    name: string;
    region?: string;
    theme?: string;
    is_public: boolean;
    created_at: string;
}

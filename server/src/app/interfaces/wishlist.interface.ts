export interface Wishlist {
    wishlist_id: string;
    place_id: string;
    user_id: string;
    name: string;
    region?: string;
    theme?: string;
    is_public: boolean;
    created_at: Date;
}

export interface IWishlistRepository {
    create(wishlist: Omit<Wishlist, 'wishlist_id' | 'created_at'>): Promise<Wishlist>;
    findById(wishlist_id: string): Promise<Wishlist | undefined>;
    findAllByUser(user_id: string): Promise<Wishlist[]>;
    update(wishlist_id: string, data: Partial<Wishlist>): Promise<Wishlist | undefined>;
    delete(wishlist_id: string): Promise<number>;
    findAll(
        filters: {
            is_public?: boolean;
            place_id?: string;
            user_id?: string;
            wishlist_id?: string;
        },
        includePrivate: boolean
    ): Promise<Wishlist[]>;
}

import { Knex } from 'knex';

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

export class WishlistRepository {
    private db: Knex;
    constructor(db: Knex) {
        this.db = db;
    }

    async create(wishlist: Omit<Wishlist, 'wishlist_id' | 'created_at'>): Promise<Wishlist> {
        const [created] = await this.db('wishlists')
            .insert({
                ...wishlist,
                is_public: wishlist.is_public ?? false
            })
            .returning('*');
        return created;
    }

    async findById(wishlist_id: string): Promise<Wishlist | undefined> {
        return this.db('wishlists').where({ wishlist_id }).first();
    }

    async findAllByUser(user_id: string): Promise<Wishlist[]> {
        return this.db('wishlists').where({ user_id }).orderBy('created_at', 'desc');
    }

    async update(wishlist_id: string, data: Partial<Wishlist>): Promise<Wishlist | undefined> {
        const [updated] = await this.db('wishlists')
            .where({ wishlist_id })
            .update(data)
            .returning('*');
        return updated;
    }

    async delete(wishlist_id: string): Promise<number> {
        return this.db('wishlists').where({ wishlist_id }).del();
    }

    async findAll(
        filters: {
            is_public?: boolean;
            place_id?: string;
            user_id?: string;
            wishlist_id?: string;
        },
        includePrivate = false
    ): Promise<Wishlist[]> {
        let query = this.db('wishlists');
        if (filters.is_public !== undefined) query = query.where('is_public', filters.is_public);
        if (filters.place_id) query = query.where('place_id', filters.place_id);
        if (filters.user_id) {
            query = query.where('user_id', filters.user_id);
            if (!includePrivate) {
                query = query.where('is_public', true);
            }
        }
        
        if (filters.wishlist_id) query = query.where('wishlist_id', filters.wishlist_id);

        // If no filters, default to public wishlists
        if (filters.is_public === undefined &&
            !filters.place_id &&
            !filters.user_id &&
            !filters.wishlist_id
        ) {
            query = query.where('is_public', true);
        }
        return query.orderBy('created_at', 'desc');
    }
}

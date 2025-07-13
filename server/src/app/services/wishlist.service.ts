import { WishlistRepository } from '../repositories/wishlist.repository.js';
import { CreateWishlistDto, UpdateWishlistDto, WishlistResponseDto } from '../dtos/wishlistDto.js';

function toWishlistResponseDto(wishlist: any): WishlistResponseDto {
    return {
        ...wishlist,
        created_at: wishlist.created_at instanceof Date ? wishlist.created_at.toISOString() : wishlist.created_at,
    };
}

export class WishlistService {
    private wishlistRepository: WishlistRepository;
    constructor(wishlistRepository: WishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    async createWishlist(user_id: string, dto: CreateWishlistDto): Promise<WishlistResponseDto> {
        const wishlist = await this.wishlistRepository.create({
            ...dto,
            user_id,
            is_public: dto.is_public ?? false,
        });
        return toWishlistResponseDto(wishlist);
    }

    // async getWishlistById(wishlist_id: string): Promise<WishlistResponseDto | undefined> {
    //     const wishlist = await this.wishlistRepository.findById(wishlist_id);
    //     return wishlist ? toWishlistResponseDto(wishlist) : undefined;
    // }

    // async getWishlistsByUser(user_id: string): Promise<WishlistResponseDto[]> {
    //     const wishlists = await this.wishlistRepository.findAllByUser(user_id);
    //     return wishlists.map(toWishlistResponseDto);
    // }

    async updateWishlist(wishlist_id: string, dto: UpdateWishlistDto): Promise<WishlistResponseDto | undefined> {
        const wishlist = await this.wishlistRepository.update(wishlist_id, dto);
        return wishlist ? toWishlistResponseDto(wishlist) : undefined;
    }

    async deleteWishlist(wishlist_id: string): Promise<number> {
        return this.wishlistRepository.delete(wishlist_id);
    }

    async getAll(
        filters: {
            is_public?: boolean;
            place_id?: string;
            user_id?: string;
            wishlist_id?: string;
        },
        includePrivate = false
    ): Promise<WishlistResponseDto[]> {
        const wishlists = await this.wishlistRepository.findAll(filters, includePrivate);
        return wishlists.map(toWishlistResponseDto);
    }
}

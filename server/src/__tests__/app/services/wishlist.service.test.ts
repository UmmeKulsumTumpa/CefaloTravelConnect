/**
 * What to test:
 * - createWishlist:
 *     • calls repository.create with DTO + user_id + default is_public = false
 *     • returns created_at as ISO string
 * - updateWishlist:
 *     • when repo.update returns undefined → service returns undefined
 *     • when repo.update returns wishlist → returns correct DTO
 * - deleteWishlist:
 *     • calls repo.delete and returns the numeric result
 * - getAll:
 *     • calls repo.findAll with provided filters and includePrivate flag
 *     • returns array of DTOs with created_at as ISO strings
 */

// tests/services/WishlistService.test.ts

import { WishlistService } from '../../../app/services/wishlist.service';

function isoDto(wish: any) {
    return {
        ...wish,
        created_at: wish.created_at.toISOString(),
    };
}

describe('WishlistService', () => {
    let mockRepo: any;
    let svc: WishlistService;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
        };
        svc = new WishlistService(mockRepo);
    });

    it('createWishlist: should call create with defaults and return converted DTO', async () => {
        const dto = { name: 'Test', place_id: 'p1' };
        const user_id = 'u1';
        const created = { ...dto, user_id, is_public: false, created_at: new Date() };
        mockRepo.create.mockResolvedValue(created);

        const result = await svc.createWishlist(user_id, dto);

        expect(mockRepo.create).toHaveBeenCalledWith({ ...dto, user_id, is_public: false });
        expect(result).toEqual(isoDto(created));
    });

    it('updateWishlist: should return undefined when no update', async () => {
        mockRepo.update.mockResolvedValue(undefined);

        const result = await svc.updateWishlist('w1', { name: 'X' });

        expect(mockRepo.update).toHaveBeenCalledWith('w1', { name: 'X' });
        expect(result).toBeUndefined();
    });

    it('updateWishlist: should return updated DTO when present', async () => {
        const updated = { id: 'w1', name: 'X', user_id: 'u1', is_public: true, created_at: new Date() };
        mockRepo.update.mockResolvedValue(updated);

        const result = await svc.updateWishlist('w1', { name: 'X' });

        expect(mockRepo.update).toHaveBeenCalledWith('w1', { name: 'X' });
        expect(result).toEqual(isoDto(updated));
    });

    it('deleteWishlist: returns repository delete value', async () => {
        mockRepo.delete.mockResolvedValue(5);

        const count = await svc.deleteWishlist('w1');

        expect(mockRepo.delete).toHaveBeenCalledWith('w1');
        expect(count).toBe(5);
    });

    it('getAll: calls findAll and returns array of DTOs', async () => {
        const raw = [
            { id: 'w1', user_id: 'u1', place_id: 'p1', is_public: true, created_at: new Date() },
            { id: 'w2', user_id: 'u2', place_id: 'p2', is_public: false, created_at: new Date() },
        ];
        mockRepo.findAll.mockResolvedValue(raw);

        const result = await svc.getAll({ user_id: 'u1' }, true);

        expect(mockRepo.findAll).toHaveBeenCalledWith({ user_id: 'u1' }, true);
        expect(result).toEqual(raw.map(isoDto));
    });
});



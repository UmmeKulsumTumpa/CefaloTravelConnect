import { WishlistValidation } from '../../../app/validations/wishlist.validation';

describe('WishlistValidation.validateCreate', () => {
  it('returns [] for valid input', () => {
    expect(WishlistValidation.validateCreate({ place_id: 'p', name: 'n' })).toEqual([]);
  });
  it('fails for missing/invalid place_id', () => {
    expect(WishlistValidation.validateCreate({ name: 'n' } as any)).toEqual(
      expect.arrayContaining([expect.stringContaining('place_id is required')])
    );
    expect(WishlistValidation.validateCreate({ place_id: 123, name: 'n' } as any)).toEqual(
      expect.arrayContaining([expect.stringContaining('place_id is required')])
    );
  });
  it('fails for missing/invalid name', () => {
    expect(WishlistValidation.validateCreate({ place_id: 'p' } as any)).toEqual(
      expect.arrayContaining([expect.stringContaining('name is required')])
    );
    expect(WishlistValidation.validateCreate({ place_id: 'p', name: 123 } as any)).toEqual(
      expect.arrayContaining([expect.stringContaining('name is required')])
    );
    expect(WishlistValidation.validateCreate({ place_id: 'p', name: 'a'.repeat(256) } as any)).toEqual(
      expect.arrayContaining([expect.stringContaining('name is required')])
    );
  });
  it('fails for invalid region', () => {
    expect(WishlistValidation.validateCreate({ place_id: 'p', name: 'n', region: 'a'.repeat(101) })).toEqual(
      expect.arrayContaining([expect.stringContaining('region max length')])
    );
  });
  it('fails for invalid theme', () => {
    expect(WishlistValidation.validateCreate({ place_id: 'p', name: 'n', theme: 'a'.repeat(101) })).toEqual(
      expect.arrayContaining([expect.stringContaining('theme max length')])
    );
  });
  it('fails for invalid is_public', () => {
    expect(WishlistValidation.validateCreate({ place_id: 'p', name: 'n', is_public: 'bad' } as any)).toEqual(
      expect.arrayContaining([expect.stringContaining('is_public must be a boolean')])
    );
  });
});

describe('WishlistValidation.validateUpdate', () => {
  it('returns [] for valid input', () => {
    expect(WishlistValidation.validateUpdate({})).toEqual([]);
  });
  it('fails for invalid name', () => {
    expect(WishlistValidation.validateUpdate({ name: 123 } as any)).toEqual(
      expect.arrayContaining([expect.stringContaining('name must be a string')])
    );
    expect(WishlistValidation.validateUpdate({ name: 'a'.repeat(256) } as any)).toEqual(
      expect.arrayContaining([expect.stringContaining('name must be a string')])
    );
  });
  it('fails for invalid region', () => {
    expect(WishlistValidation.validateUpdate({ region: 'a'.repeat(101) })).toEqual(
      expect.arrayContaining([expect.stringContaining('region max length')])
    );
  });
  it('fails for invalid theme', () => {
    expect(WishlistValidation.validateUpdate({ theme: 'a'.repeat(101) })).toEqual(
      expect.arrayContaining([expect.stringContaining('theme max length')])
    );
  });
  it('fails for invalid is_public', () => {
    expect(WishlistValidation.validateUpdate({ is_public: 'bad' } as any)).toEqual(
      expect.arrayContaining([expect.stringContaining('is_public must be a boolean')])
    );
  });
});

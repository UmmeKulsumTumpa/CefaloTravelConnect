## Functions to Test in `wishlist.validation`

1. **WishlistValidation.validateCreate**
   - Returns [] for valid input
   - Fails for missing/invalid place_id, name, region, theme, is_public
2. **WishlistValidation.validateUpdate**
   - Returns [] for valid input
   - Fails for invalid name, region, theme, is_public

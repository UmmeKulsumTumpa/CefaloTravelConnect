## Methods to Test in `PostImageService`

1. **addImageToPost**
   - Calls checkPostOwnership (success, post not found, forbidden)
   - Calls repository.addImage and returns result
2. **getImagesForPost**
   - Calls repository.getPostImages and returns result
3. **removeImageFromPost**
   - Calls checkPostOwnership (success, post not found, forbidden)
   - Calls repository.deleteImage and returns result

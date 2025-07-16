## Methods to Test in `PostServiceService`

1. **addServiceToPost**
   - Calls checkPostOwnership (success, post not found, forbidden)
   - Calls repository.addPostService and returns result
2. **getServicesForPost**
   - Calls repository.getPostServices and returns result
3. **removeServiceFromPost**
   - Calls checkPostOwnership (success, post not found, forbidden)
   - Calls repository.deletePostService and returns result

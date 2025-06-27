
## Methods to Test in `UserService`

1. **signup**
   - New user registration (success)
   - User already exists (throws error)
   - User role not set (throws error)
2. **signin**
   - Successful login
   - User not found (throws error)
   - Incorrect password (throws error)
   - User role not set (throws error)
3. **updateMe**
   - Update own profile (success)
   - Update with invalid user id (throws error)
   - Unauthorized update (not self or not admin, throws error)
   - Non-admin tries to change role (throws error)
   - User not found (throws error)
   - User inactive (throws error)
4. **changePassword**
   - Successful password change
   - User not found (returns false)
   - Old password does not match (returns false)
5. **deleteUser**
   - Admin deletes another user (success)
   - Non-admin tries to delete (throws error)
   - Admin tries to delete self (throws error)
   - User not found (throws error)
6. **signout**
   - Calls repository to delete refresh token
7. **refresh**
   - Valid refresh token (success)
   - Invalid/expired refresh token (throws error)
   - User not found (throws error)
8. **changeUserRole**
   - Admin changes role (success)
   - Invalid role (throws error)
   - Non-admin tries to change role (throws error)
   - User not found (throws error)
9. **getUsers**
   - Admin fetches users (success)
   - Non-admin fetches own data (success)
   - Non-admin tries to fetch other users (throws error)
   - Unauthorized/no role (throws error)


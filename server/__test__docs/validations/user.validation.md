## Functions to Test in `user.validation`

1. **signupSchema**
   - Passes for valid input
   - Fails for invalid email, password, role
2. **signinSchema**
   - Passes for valid input
   - Fails for invalid email, password
3. **updateUserSchema**
   - Passes for valid input
   - Fails for invalid username, email, first_name, last_name, age, role, profile_picture, bio
4. **changePasswordSchema**
   - Passes for valid input
   - Fails for invalid oldPassword, newPassword

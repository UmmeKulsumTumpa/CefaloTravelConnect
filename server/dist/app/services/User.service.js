import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import envConfig from "../config/env.config.js";
import jwtConfig from "../config/jwt.config.js";
export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    ;
    async signup(dto) {
        // need to implement validation for dto, will do later
        const { email, password } = dto;
        const existingUser = await this.userRepository.findUsers({ email });
        if (existingUser.length > 0) {
            throw new Error("User with this email already exists");
        }
        ;
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = await this.userRepository.create({
            email,
            password_hash: passwordHash,
        });
        const token = jwt.sign({ user_id: String(userId), email }, envConfig.JWT_SECRET, { expiresIn: jwtConfig.EXPIRATION });
        return token;
    }
    async signin(email, password) {
        const users = await this.userRepository.findUsers({ email });
        if (users.length === 0) {
            throw new Error("User not found with this email");
        }
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error("User password for this email is incorrect");
        }
        const token = jwt.sign({ user_id: String(user.user_id), email: user.email, role: user.role }, envConfig.JWT_SECRET, { expiresIn: jwtConfig.EXPIRATION });
        return token;
    }
    // might need a getUsers method later, for admin to get all users
    async getMe(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.is_active) {
            throw new Error("User is inactive");
        }
        return user;
    }
    async updateMe(userId, dto, requesterRole) {
        // Validate the dto, will do later
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (requesterRole !== 'admin' && requesterRole !== user.role) {
            throw new Error("Unauthorized: You can only update your own profile");
        }
        if (dto.role && requesterRole !== 'admin') {
            throw new Error("Unauthorized: Only admin can change user roles");
        }
        return this.userRepository.update(userId, dto);
    }
    async deleteUser(userId, requesterId, requesterRole) {
        if (requesterRole !== 'admin') {
            throw new Error("Unauthorized: Only admin can delete users");
        }
        if (userId === requesterId) {
            throw new Error("Unauthorized: You cannot delete your own account");
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return this.userRepository.delete(userId);
    }
}
//# sourceMappingURL=User.service.js.map
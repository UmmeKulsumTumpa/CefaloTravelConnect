import { UserService } from "../../../app/services/User.service";
import { ROLES } from "../../../app/constants/User.constant";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import authConfig from "../../../app/config/auth.config";
import { mockUserRepository } from "../../../test-utils/mockUserRepository.js";

jest.mock("jsonwebtoken");
jest.mock("bcryptjs");
jest.mock("crypto");

describe("UserService - signup", () => {
    let userRepository: any;
    let userService: UserService;

    beforeEach(() => {
        userRepository = mockUserRepository();
        userService = new UserService(userRepository);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
        (jwt.sign as jest.Mock).mockReturnValue("accessToken");
        (crypto.randomBytes as jest.Mock).mockReturnValue({ toString: () => "refreshToken" });
    });

    it("should signup a new user successfully", async () => {
        userRepository.findUsers.mockResolvedValue([]);
        userRepository.create.mockResolvedValue(1);
        userRepository.findById.mockResolvedValue({ user_id: 1, role: ROLES.EXPLORER });
        userRepository.saveRefreshToken.mockResolvedValue(undefined);

        const dto = { email: "test@example.com", password: "password123" };
        const result = await userService.signup(dto);

        expect(userRepository.findUsers).toHaveBeenCalledWith({ email: dto.email });
        expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
        expect(userRepository.create).toHaveBeenCalled();
        expect(jwt.sign).toHaveBeenCalled();
        expect(userRepository.saveRefreshToken).toHaveBeenCalled();
        expect(result).toHaveProperty("accessToken", "accessToken");
        expect(result).toHaveProperty("refreshToken", "refreshToken");
    });

    it("should throw error if user already exists", async () => {
        userRepository.findUsers.mockResolvedValue([{ email: "test@example.com" }]);
        const dto = { email: "test@example.com", password: "password123" };

        await expect(userService.signup(dto)).rejects.toThrow("User with this email already exists");
    });

    it("should throw error if user role is not set", async () => {
        userRepository.findUsers.mockResolvedValue([]);
        userRepository.create.mockResolvedValue(1);
        userRepository.findById.mockResolvedValue({ user_id: 1 });
        const dto = { email: "test@example.com", password: "password123" };

        await expect(userService.signup(dto)).rejects.toThrow("User role is not set. Please contact admin.");
    });
});

describe("UserService - signin", () => {
    let userRepository: any;
    let userService: UserService;

    beforeEach(() => {
        userRepository = mockUserRepository();
        userService = new UserService(userRepository);
        (bcrypt.compare as jest.Mock).mockReset();
        (jwt.sign as jest.Mock).mockReturnValue("accessToken");
        (crypto.randomBytes as jest.Mock).mockReturnValue({ toString: () => "refreshToken" });
    });

    it("should signin successfully", async () => {
        userRepository.findUsers.mockResolvedValue([{ user_id: 1, email: "test@example.com", password_hash: "hashed", role: ROLES.EXPLORER }]);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        userRepository.saveRefreshToken.mockResolvedValue(undefined);

        const result = await userService.signin("test@example.com", "password123");

        expect(result).toHaveProperty("accessToken", "accessToken");
        expect(result).toHaveProperty("refreshToken", "refreshToken");
    });

    it("should throw if user not found", async () => {
        userRepository.findUsers.mockResolvedValue([]);

        await expect(userService.signin("notfound@example.com", "password123")).rejects.toThrow("User not found with this email");
    });

    it("should throw if password is incorrect", async () => {
        userRepository.findUsers.mockResolvedValue([{ user_id: 1, email: "test@example.com", password_hash: "hashed", role: ROLES.EXPLORER }]);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(userService.signin("test@example.com", "wrongpass")).rejects.toThrow("User password for this email is incorrect");
    });

    it("should throw if user role is not set", async () => {
        userRepository.findUsers.mockResolvedValue([{ user_id: 1, email: "test@example.com", password_hash: "hashed" }]);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        await expect(userService.signin("test@example.com", "password123")).rejects.toThrow("User role is not set. Please contact admin.");
    });
});

describe("UserService - updateMe", () => {
    let userRepository: any;
    let userService: UserService;

    beforeEach(() => {
        userRepository = mockUserRepository();
        userService = new UserService(userRepository);
    });

    it("should update own profile as explorer", async () => {
        userRepository.findById.mockResolvedValue({ user_id: 1, is_active: true });
        userRepository.update.mockResolvedValue(true);

        const result = await userService.updateMe(1, { username: "New Name" }, { user_id: 1, role: ROLES.EXPLORER });

        expect(result).toBe(true);
    });

    it("should throw if userId is invalid", async () => {
        await expect(userService.updateMe(undefined as any, {}, { user_id: 1, role: ROLES.EXPLORER })).rejects.toThrow("Invalid user id");
    });

    it("should throw if requester is invalid", async () => {
        await expect(userService.updateMe(1, {}, { user_id: 1 } as any)).rejects.toThrow("Unauthorized: Invalid requester info");
    });

    it("should throw if not admin and not self", async () => {
        await expect(userService.updateMe(2, {}, { user_id: 1, role: ROLES.EXPLORER })).rejects.toThrow("Unauthorized: You can only update your own profile");
    });

    it("should throw if non-admin tries to change role", async () => {
        await expect(userService.updateMe(1, { role: ROLES.ADMIN }, { user_id: 1, role: ROLES.EXPLORER })).rejects.toThrow("Unauthorized: Only admin can change user roles");
    });

    it("should throw if user not found", async () => {
        userRepository.findById.mockResolvedValue(undefined);

        await expect(userService.updateMe(1, {}, { user_id: 1, role: ROLES.EXPLORER })).rejects.toThrow("User not found");
    });

    it("should throw if user is inactive", async () => {
        userRepository.findById.mockResolvedValue({ user_id: 1, is_active: false });

        await expect(userService.updateMe(1, {}, { user_id: 1, role: ROLES.EXPLORER })).rejects.toThrow("User is inactive");
    });
});

describe("UserService - changePassword", () => {
    let userRepository: any;
    let userService: UserService;

    beforeEach(() => {
        userRepository = mockUserRepository();
        userService = new UserService(userRepository);
        (bcrypt.compare as jest.Mock).mockReset();
        (bcrypt.hash as jest.Mock).mockReset();
    });

    it("should change password successfully", async () => {
        userRepository.findById.mockResolvedValue({ user_id: 1, password_hash: "oldhash" });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (bcrypt.hash as jest.Mock).mockResolvedValue("newhash");
        userRepository.update.mockResolvedValue(true);

        const result = await userService.changePassword(1, { oldPassword: "old", newPassword: "new" });

        expect(result).toBe(true);
    });

    it("should return false if user not found", async () => {
        userRepository.findById.mockResolvedValue(undefined);

        const result = await userService.changePassword(1, { oldPassword: "old", newPassword: "new" });

        expect(result).toBe(false);
    });

    it("should return false if old password does not match", async () => {
        userRepository.findById.mockResolvedValue({ user_id: 1, password_hash: "oldhash" });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const result = await userService.changePassword(1, { oldPassword: "old", newPassword: "new" });

        expect(result).toBe(false);
    });
});

describe("UserService - deleteUser", () => {
    let userRepository: any;
    let userService: UserService;

    beforeEach(() => {
        userRepository = mockUserRepository();
        userService = new UserService(userRepository);
    });

    it("should delete user as admin", async () => {
        userRepository.findById.mockResolvedValue({ user_id: 2 });
        userRepository.delete.mockResolvedValue(true);

        const result = await userService.deleteUser(2, 1, ROLES.ADMIN);

        expect(result).toBe(true);
    });

    it("should throw if not admin", async () => {
        await expect(userService.deleteUser(2, 1, ROLES.EXPLORER)).rejects.toThrow("Unauthorized: Only admin can delete users");
    });

    it("should throw if admin tries to delete self", async () => {
        await expect(userService.deleteUser(1, 1, ROLES.ADMIN)).rejects.toThrow("Unauthorized: You cannot delete your own account");
    });

    it("should throw if user not found", async () => {
        userRepository.findById.mockResolvedValue(undefined);

        await expect(userService.deleteUser(2, 1, ROLES.ADMIN)).rejects.toThrow("User not found");
    });
});

describe("UserService - signout", () => {
    it("should call deleteRefreshToken", async () => {
        const userRepository = mockUserRepository();
        const userService = new UserService(userRepository);

        await userService.signout("refreshToken");

        expect(userRepository.deleteRefreshToken).toHaveBeenCalledWith("refreshToken");
    });
});

describe("UserService - refresh", () => {
    let userRepository: any;
    let userService: UserService;

    beforeEach(() => {
        userRepository = mockUserRepository();
        userService = new UserService(userRepository);
        (jwt.sign as jest.Mock).mockReturnValue("accessToken");
        (crypto.randomBytes as jest.Mock).mockReturnValue({ toString: () => "newRefreshToken" });
    });

    it("should refresh tokens successfully", async () => {
        userRepository.findRefreshToken.mockResolvedValue({ user_id: 1, expires_at: new Date(Date.now() + 10000) });
        userRepository.findById.mockResolvedValue({ user_id: 1, email: "test@example.com", role: ROLES.EXPLORER });
        userRepository.saveRefreshToken.mockResolvedValue(undefined);

        const result = await userService.refresh("refreshToken");

        expect(result).toHaveProperty("accessToken", "accessToken");
        expect(result).toHaveProperty("refreshToken", "newRefreshToken");
    });

    it("should throw if refresh token is invalid or expired", async () => {
        userRepository.findRefreshToken.mockResolvedValue(undefined);

        await expect(userService.refresh("badToken")).rejects.toThrow("Invalid or expired refresh token");
    });

    it("should throw if user not found", async () => {
        userRepository.findRefreshToken.mockResolvedValue({ user_id: 1, expires_at: new Date(Date.now() + 10000) });

        userRepository.findById.mockResolvedValue(undefined);

        await expect(userService.refresh("refreshToken")).rejects.toThrow("User not found");
    });
});

describe("UserService - changeUserRole", () => {
    let userRepository: any;
    let userService: UserService;

    beforeEach(() => {
        userRepository = mockUserRepository();
        userService = new UserService(userRepository);
    });

    it("should change user role as admin", async () => {
        userRepository.findById.mockResolvedValue({ user_id: 2 });
        userRepository.update.mockResolvedValue(true);

        const result = await userService.changeUserRole(2, ROLES.EXPLORER, ROLES.ADMIN);

        expect(result).toBe(true);
    });

    it("should throw if role is invalid", async () => {
        await expect(userService.changeUserRole(2, "invalid", ROLES.ADMIN)).rejects.toThrow("Invalid role");
    });

    it("should throw if not admin", async () => {
        await expect(userService.changeUserRole(2, ROLES.EXPLORER, ROLES.EXPLORER)).rejects.toThrow("Unauthorized: Only admin can change user roles");
    });

    it("should throw if user not found", async () => {
        userRepository.findById.mockResolvedValue(undefined);
        await expect(userService.changeUserRole(2, ROLES.EXPLORER, ROLES.ADMIN)).rejects.toThrow("User not found");
    });
});

describe("UserService - getUsers", () => {
    let userRepository: any;
    let userService: UserService;

    beforeEach(() => {
        userRepository = mockUserRepository();
        userService = new UserService(userRepository);
    });

    it("should get users as admin", async () => {
        userRepository.findUsers.mockResolvedValue([{ user_id: 1, email: "a", password_hash: "h", role: ROLES.EXPLORER }]);

        const result = await userService.getUsers({}, { user_id: 1, role: ROLES.ADMIN });

        expect(result[0]).toHaveProperty("email");
    });

    it("should get own user as explorer", async () => {
        userRepository.findUsers.mockResolvedValue([{ user_id: 1, email: "a", password_hash: "h", role: ROLES.EXPLORER }]);

        const result = await userService.getUsers({}, { user_id: 1, role: ROLES.EXPLORER });

        expect(result[0]).not.toHaveProperty("email");
    });

    it("should throw if non-admin tries to get other user", async () => {
        await expect(userService.getUsers({ id: 2 }, { user_id: 1, role: ROLES.EXPLORER })).rejects.toThrow("Forbidden: Cannot view other users");
    });

    it("should throw if unauthorized", async () => {
        await expect(userService.getUsers({}, null)).rejects.toThrow("Unauthorized");
    });
    
    it("should throw if user role missing", async () => {
        await expect(userService.getUsers({}, { user_id: 1 })).rejects.toThrow("Unauthorized: User role is missing in token.");
    });
});

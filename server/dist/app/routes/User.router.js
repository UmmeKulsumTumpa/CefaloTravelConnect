import express from 'express';
import { UserController } from '../controllers/User.controller.js';
import { UserService } from '../services/User.service.js';
import { UserRepository } from '../repositories/User.repository.js';
import db from '../../db.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = express.Router();
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
router.post('/signup', asyncHandler(userController.signup.bind(userController)));
router.post('/signin', asyncHandler(userController.signin.bind(userController)));
router.get('/me', authenticateToken, asyncHandler(userController.getMe.bind(userController)));
router.put('/me', authenticateToken, asyncHandler(userController.updateMe.bind(userController)));
router.delete('/', authenticateToken, asyncHandler(userController.deleteUser.bind(userController)));
export const UserRouter = router;
//# sourceMappingURL=User.router.js.map
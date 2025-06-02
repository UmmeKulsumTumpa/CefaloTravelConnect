import express from 'express';
import { UserController } from '../controllers/User.controller.js';
import { UserService } from '../services/User.service.js';
import { UserRepository } from '../repositories/User.repository.js';
import db from '../../db.js';

const router = express.Router();
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/signup', (req, res, next) => userController.signup(req, res, next));

export const UserRouter = router;

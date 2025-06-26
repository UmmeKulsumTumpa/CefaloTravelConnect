import express from 'express';
import { UserController } from '../controllers/User.controller.js';
import { UserService } from '../services/User.service.js';
import { UserRepository } from '../repositories/User.repository.js';
import db from '../../db.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { requestValidationMiddleware } from '../middlewares/requestValidation.middleware.js';
import { signupSchema, signinSchema, updateUserSchema, changePasswordSchema } from '../validations/User.validation.js';

const router = express.Router();
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/', 
    requestValidationMiddleware(signupSchema), 
    asyncHandler(userController.signup.bind(userController))
);

router.post('/login', 
    requestValidationMiddleware(signinSchema), 
    asyncHandler(userController.signin.bind(userController))
);

router.post('/logout', 
    authenticationMiddleware, 
    asyncHandler(userController.signout.bind(userController))
);

router.post('/refresh', 
    asyncHandler(userController.refresh.bind(userController))
);

router.get('/', 
    authenticationMiddleware, 
    asyncHandler(userController.getUsers.bind(userController))
);

// router.get('/:id', authenticationMiddleware, asyncHandler(async (req, res, next) => {
//     // Forward to getUsers with id param for consistency
//     req.query.id = req.params.id;
//     return userController.getUsers(req, res, next);
// }));

router.patch('/:id', 
    authenticationMiddleware, 
    requestValidationMiddleware(updateUserSchema), 
    asyncHandler(userController.updateUser.bind(userController))
)
;
router.patch('/:id/password', 
    authenticationMiddleware, 
    requestValidationMiddleware(changePasswordSchema), 
    asyncHandler(userController.changePassword.bind(userController))
);


router.patch('/:id/role', 
    authenticationMiddleware, 
    roleMiddleware(['admin']), asyncHandler(userController.changeUserRole.bind(userController))
);

router.delete('/:id', 
    authenticationMiddleware, 
    roleMiddleware(['admin']), 
    asyncHandler(userController.deleteUser.bind(userController))
);

export const UserRouter = router;

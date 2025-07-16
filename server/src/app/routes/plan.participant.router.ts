import express from 'express';
import { PlanParticipantController } from '../controllers/index.js';
import { TravelPlanService, UserService  } from '../services/index.js';
import { TravelPlanRepository, UserRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { authenticationMiddleware, optionalAuthentication } from '../middlewares/index.js';
import { asyncHandler } from '../utils/index.js';

const router = express.Router({ mergeParams: true });

const travelPlanRepository = new TravelPlanRepository(db);
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const travelPlanService = new TravelPlanService(travelPlanRepository, userService);
const planParticipantController = new PlanParticipantController(travelPlanService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(planParticipantController.addPlanParticipant.bind(planParticipantController))
);

router.get(
    '/',
    optionalAuthentication,
    asyncHandler(planParticipantController.getPlanParticipants.bind(planParticipantController))
);

router.patch(
    '/:user_id',
    authenticationMiddleware,
    asyncHandler(planParticipantController.updatePlanParticipant.bind(planParticipantController))
);

router.delete(
    '/:user_id',
    authenticationMiddleware,
    asyncHandler(planParticipantController.deletePlanParticipant.bind(planParticipantController))
);

export default router;

import express from 'express';
import { PlanParticipantController } from '../controllers/PlanParticipant.controller.js';
import { TravelPlanService } from '../services/TravelPlan.service.js';
import { TravelPlanRepository } from '../repositories/TravelPlan.repository.js';
import db from '../../db/db.js';
import { optionalAuthentication } from '../middlewares/optionalAuthentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import { UserRepository } from '../repositories/User.repository.js';
import { UserService } from '../services/User.service.js';

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

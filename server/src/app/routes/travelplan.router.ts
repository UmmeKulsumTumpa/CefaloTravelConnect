import express from 'express';
import { TravelPlanController } from '../controllers/index.js';
import { TravelPlanService, UserService } from '../services/index.js';
import { TravelPlanRepository, UserRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { authenticationMiddleware, optionalAuthentication } from '../middlewares/index.js';
import { asyncHandler } from '../utils/index.js';
import {TravelPlanPlaceRouter, TravelPlanServiceRouter, PlanParticipantRouter} from './sub-index.js';

const router = express.Router();

const travelPlanRepository = new TravelPlanRepository(db);
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const travelPlanService = new TravelPlanService(travelPlanRepository, userService);
const travelPlanController = new TravelPlanController(travelPlanService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(travelPlanController.createTravelPlan.bind(travelPlanController))
);

router.get(
    '/',
    optionalAuthentication,
    asyncHandler(travelPlanController.getAllTravelPlans.bind(travelPlanController))
);

router.get(
    '/:plan_id',
    optionalAuthentication,
    asyncHandler(travelPlanController.getTravelPlanById.bind(travelPlanController))
);

router.patch(
    '/:plan_id',
    authenticationMiddleware,
    asyncHandler(travelPlanController.updateTravelPlan.bind(travelPlanController))
);

router.delete(
    '/:plan_id',
    authenticationMiddleware,
    asyncHandler(travelPlanController.deleteTravelPlan.bind(travelPlanController))
);

// plan comments routers
router.post(
    '/:plan_id/comments',
    authenticationMiddleware,
    asyncHandler(travelPlanController.addPlanComment.bind(travelPlanController))
);

router.get(
    '/:plan_id/comments',
    optionalAuthentication,
    asyncHandler(travelPlanController.getPlanComments.bind(travelPlanController))
);

// plan participants, places, and services routers
router.use(
    '/:plan_id/participants',
    PlanParticipantRouter
);

router.use(
    '/:plan_id/places',
    TravelPlanPlaceRouter
);

router.use(
    '/:plan_id/services',
    TravelPlanServiceRouter
);

export default router;

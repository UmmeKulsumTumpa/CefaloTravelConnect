import express from 'express';
import { TravelPlanController } from '../controllers/TravelPlan.controller.js';
import { TravelPlanService } from '../services/TravelPlan.service.js';
import { TravelPlanRepository } from '../repositories/TravelPlan.repository.js';
import db from '../../db/db.js';
import { optionalAuthentication } from '../middlewares/optionalAuthentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import TravelPlanPlaceRouter from './TravelPlanPlace.router.js';
import TravelPlanServiceRouter from './TravelPlanService.router.js';
import PlanParticipantRouter from './PlanParticipant.router.js';
import { UserRepository } from '../repositories/User.repository.js';
import { UserService } from '../services/User.service.js';
import TravelPlanTransportRouter from './TravelPlanTransport.router.js';

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

// plan participants, places, services and transports routers
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

router.use(
    '/:plan_id/transports',
    TravelPlanTransportRouter
);

export default router;

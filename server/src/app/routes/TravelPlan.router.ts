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

const router = express.Router();

const travelPlanRepository = new TravelPlanRepository(db);
const travelPlanService = new TravelPlanService(travelPlanRepository);
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

// plan participants routers
router.post(
    '/:plan_id/participants',
    authenticationMiddleware,
    asyncHandler(travelPlanController.addPlanParticipant.bind(travelPlanController))
);

router.get(
    '/:plan_id/participants',
    optionalAuthentication,
    asyncHandler(travelPlanController.getPlanParticipants.bind(travelPlanController))
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

// plan places, services and transports routers
router.use(
    '/:plan_id/places',
    authenticationMiddleware,
    TravelPlanPlaceRouter
);

router.use(
    '/:plan_id/services',
    authenticationMiddleware,
    TravelPlanServiceRouter
);

export default router;

import express from 'express';
import { TravelPlanServiceController } from '../controllers/TravelPlanService.controller.js';
import { TravelPlanService } from '../services/TravelPlanService.service.js';
import { TravelPlanRepository } from '../repositories/TravelPlan.repository.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router({ mergeParams: true });

const travelPlanRepository = new TravelPlanRepository(db);
const travelPlanService = new TravelPlanService(travelPlanRepository);
const travelPlanServiceController = new TravelPlanServiceController(travelPlanService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(travelPlanServiceController.addPlanService.bind(travelPlanServiceController))
);

router.get(
    '/',
    authenticationMiddleware,
    asyncHandler(travelPlanServiceController.getPlanServices.bind(travelPlanServiceController))
);

export default router;

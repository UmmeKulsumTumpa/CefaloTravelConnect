import express from 'express';
import { TravelPlanServiceController } from '../controllers/index.js';
import { TravelPlanServices } from '../services/index.js';
import { TravelPlanRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/index.js';
import { asyncHandler } from '../utils/index.js';

const router = express.Router({ mergeParams: true });

const travelPlanRepository = new TravelPlanRepository(db);
const travelPlanService = new TravelPlanServices(travelPlanRepository);
const travelPlanServiceController = new TravelPlanServiceController(travelPlanService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(travelPlanServiceController.addPlanService.bind(travelPlanServiceController))
);

router.get(
    '/',
    asyncHandler(travelPlanServiceController.getPlanServices.bind(travelPlanServiceController))
);

router.patch(
    '/:service_id',
    authenticationMiddleware,
    asyncHandler(travelPlanServiceController.updatePlanService.bind(travelPlanServiceController))
);

router.delete(
    '/:service_id',
    authenticationMiddleware,
    asyncHandler(travelPlanServiceController.deletePlanService.bind(travelPlanServiceController))
);

export default router;

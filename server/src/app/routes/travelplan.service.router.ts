import express from 'express';
import { TravelPlanServiceController } from '../controllers/travelplan.service.controller.js';
import { TravelPlanService } from '../services/travelplan.service.service.js';
import { TravelPlanRepository } from '../repositories/travelplan.repository.js';
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

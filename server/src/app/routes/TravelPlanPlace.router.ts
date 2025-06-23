import express from 'express';
import { TravelPlanPlaceController } from '../controllers/TravelPlanPlace.controller.js';
import { TravelPlanPlaceService } from '../services/TravelPlanPlace.service.js';
import { TravelPlanRepository } from '../repositories/TravelPlan.repository.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router({ mergeParams: true });

const travelPlanRepository = new TravelPlanRepository(db);
const travelPlanPlaceService = new TravelPlanPlaceService(travelPlanRepository);
const travelPlanPlaceController = new TravelPlanPlaceController(travelPlanPlaceService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(travelPlanPlaceController.addPlannedPlace.bind(travelPlanPlaceController))
);

router.get(
    '/',
    authenticationMiddleware,
    asyncHandler(travelPlanPlaceController.getPlannedPlaces.bind(travelPlanPlaceController))
);

export default router;

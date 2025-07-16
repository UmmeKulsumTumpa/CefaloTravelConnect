import express from 'express';
import { TravelPlanPlaceController } from '../controllers/index.js';
import { TravelPlanPlaceService } from '../services/index.js';
import { TravelPlanRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/index.js';
import { asyncHandler } from '../utils/index.js';

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
    asyncHandler(travelPlanPlaceController.getPlannedPlaces.bind(travelPlanPlaceController))
);

export default router;

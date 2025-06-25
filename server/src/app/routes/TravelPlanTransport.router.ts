import express from 'express';
import { TravelPlanTransportController } from '../controllers/TravelPlanTransport.controller.js';
import { TravelPlanTransportService } from '../services/TravelPlanTransport.service.js';
import { TravelPlanRepository } from '../repositories/TravelPlan.repository.js';
import db from '../../db/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';

const router = express.Router( { mergeParams: true } );
const travelPlanRepository = new TravelPlanRepository(db);
const travelPlanTransportService = new TravelPlanTransportService(travelPlanRepository);
const travelPlanTransportController = new TravelPlanTransportController(travelPlanTransportService);

router.post(
  '/',
  authenticationMiddleware,
  asyncHandler(travelPlanTransportController.addPlanTransport.bind(travelPlanTransportController))
);

router.get(
  '/',
  asyncHandler(travelPlanTransportController.getPlanTransports.bind(travelPlanTransportController))
);

export default router;

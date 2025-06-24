import express from 'express';
import { TransportRepository } from '../repositories/Transport.repository.js';
import { TransportService } from '../services/Transport.service.js';
import { TransportController } from '../controllers/Transport.controller.js';
import db from '../../db/db.js';
import { authenticationMiddleware } from '../middlewares/authentication.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ServiceRepository } from '../repositories/Service.repository.js';
import { ServiceService } from '../services/Service.service.js';

const router = express.Router();

const transportRepository = new TransportRepository(db);
const serviceRepository = new ServiceRepository(db);
const serviceService = new ServiceService(serviceRepository);
const transportService = new TransportService(transportRepository, serviceService);
const transportController = new TransportController(transportService);

router.post(
    '/',
    authenticationMiddleware,
    asyncHandler(transportController.createTransport.bind(transportController))
);

router.get(
    '/',
    asyncHandler(transportController.getTransports.bind(transportController))
);

router.put(
    '/:service_id',
    authenticationMiddleware,
    asyncHandler(transportController.updateTransport.bind(transportController))
);

router.delete(
    '/:service_id',
    authenticationMiddleware,
    asyncHandler(transportController.deleteTransport.bind(transportController))
);

export default router;

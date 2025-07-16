import express from 'express';
import { ServiceController } from '../controllers/index.js';
import { ServiceService, TransportService } from '../services/index.js';
import { ServiceRepository, TransportRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { asyncHandler } from '../utils/index.js';

const router = express.Router();

const serviceRepository = new ServiceRepository(db);
const transportRepository = new TransportRepository(db);
const transportService = new TransportService(transportRepository);
const serviceService = new ServiceService(serviceRepository, transportService);
const serviceController = new ServiceController(serviceService);

// will add the authorization middleware later, for create delete and update operations

router.post(
    '/',
    asyncHandler(serviceController.create.bind(serviceController))
);

router.get(
    '/',
    asyncHandler(serviceController.getAll.bind(serviceController))
);

router.get(
    '/nearby',
    asyncHandler(serviceController.findNearbyServices.bind(serviceController))
);

router.get(
    '/:id',
    asyncHandler(serviceController.getById.bind(serviceController))
);

router.patch(
    '/:id',
    asyncHandler(serviceController.update.bind(serviceController))
);

router.delete(
    '/:id',
    asyncHandler(serviceController.delete.bind(serviceController))
);

export default router;

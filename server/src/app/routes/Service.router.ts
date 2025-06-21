import express from 'express';
import { ServiceController } from '../controllers/Service.controller.js';
import { ServiceService } from '../services/Service.service.js';
import { ServiceRepository } from '../repositories/Service.repository.js';
import db from '../../db/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const serviceRepository = new ServiceRepository(db);
const serviceService = new ServiceService(serviceRepository);
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

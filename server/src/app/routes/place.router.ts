import express from 'express';
import { PlaceController } from '../controllers/index.js';
import { PlaceService } from '../services/index.js';
import { PlaceRepository } from '../repositories/index.js';
import db from '../../db/db.js';
import { asyncHandler } from '../utils/index.js';
import { placeCreateValidator, placeUpdateValidator, placeQueryValidator } from '../middlewares/index.js';

const router = express.Router();

const placeRepository = new PlaceRepository(db);
const placeService = new PlaceService(placeRepository);
const placeController = new PlaceController(placeService);

router.post(
    '/', 
    placeCreateValidator, 
    asyncHandler(placeController.create.bind(placeController))
);

router.get('/', 
    placeQueryValidator, 
    asyncHandler(placeController.getAll.bind(placeController))
);

router.get(
    '/:place_id', 
    asyncHandler(placeController.getById.bind(placeController))
);

router.patch(
    '/:place_id', 
    placeUpdateValidator, 
    asyncHandler(placeController.update.bind(placeController))
);

router.delete(
    '/:place_id', 
    asyncHandler(placeController.delete.bind(placeController))
);

export default router;

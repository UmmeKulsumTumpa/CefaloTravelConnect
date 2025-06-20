import { Router } from 'express';
import { GeolocationController } from '../controllers/Geolocation.controller.js';
import { validateGeolocation, validateGeolocationUpdate } from '../validations/Geolocation.validation.js';
import {asyncHandler} from '../utils/asyncHandler.js';

const router = Router();

router.post('/', validateGeolocation, asyncHandler(GeolocationController.createGeolocation));
router.get('/', asyncHandler(GeolocationController.listGeolocations));
router.get('/:id', asyncHandler(GeolocationController.getGeolocationById));
router.put('/:id', validateGeolocationUpdate, asyncHandler(GeolocationController.updateGeolocation));
router.delete('/:id', asyncHandler(GeolocationController.deleteGeolocation));

export const GeolocationRouter =  router;

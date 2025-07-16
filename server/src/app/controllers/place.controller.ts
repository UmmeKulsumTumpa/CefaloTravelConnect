import type { Request, Response, NextFunction } from 'express';
import type { PlaceService } from '../services/index.js';
import {sendResponse} from '../utils/index.js';

export class PlaceController {
    constructor(private placeService: PlaceService) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const place = await this.placeService.createPlace(req.body);
            sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Place created successfully',
                data: place
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const places = await this.placeService.getAllPlaces(req.query);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Places fetched successfully',
                data: places
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const place = await this.placeService.getPlaceById(req.params.place_id);
            if (!place) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Place not found',
                    data: null as any
                });
                return;
            }
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Place fetched successfully',
                data: place
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const place = await this.placeService.updatePlace(req.params.place_id, req.body);
            if (!place) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Place not found',
                    data: null as any
                });
                return;
            }
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Place updated successfully',
                data: place
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deleted = await this.placeService.deletePlace(req.params.place_id);
            if (!deleted) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Place not found',
                    data: null as any
                });
                return;
            }
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Place deleted successfully',
                data: null as any
            });
        } catch (error) {
            next(error);
        }
    }
}

import { Request, Response, NextFunction } from 'express';
import { GeolocationService } from '../services/Geolocation.service.js';
import { GeolocationDto } from '../dtos/GeolocationDto.js';
import sendResponse from '../utils/sendResponse.js';

const geolocationService = new GeolocationService();

export class GeolocationController {
    static async createGeolocation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: GeolocationDto = req.body;
            const result = await geolocationService.createGeolocation(data);
            sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Geolocation created successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getGeolocationById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const result = await geolocationService.getGeolocationById(id);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Geolocation fetched successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateGeolocation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const data: Partial<GeolocationDto> = req.body;
            const result = await geolocationService.updateGeolocation(id, data);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Geolocation updated successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteGeolocation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await geolocationService.deleteGeolocation(id);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Geolocation deleted successfully',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }

    static async listGeolocations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { lat, lng, radius, address, limit, offset } = req.query;
            const filter = {
                lat: lat ? Number(lat) : undefined,
                lng: lng ? Number(lng) : undefined,
                radius: radius ? Number(radius) : undefined,
                address: address ? String(address) : undefined,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined,
            };
            const result = await geolocationService.listGeolocations(filter);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Geolocations fetched successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

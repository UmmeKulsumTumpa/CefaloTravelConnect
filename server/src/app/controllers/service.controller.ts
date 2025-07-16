import type { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/index.js';
import {sendResponse} from '../utils/index.js';
import { ServiceCreateRequestDto, ServiceUpdateRequestDto } from '../dtos/index.js';

export class ServiceController {
    constructor(private serviceService: ServiceService) {}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, type, latitude, longitude, address, description, transport } = req.body;
            const createDto: ServiceCreateRequestDto = { name, type, latitude, longitude, address, description, transport };
            const service = await this.serviceService.createService(createDto);
            sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Service created',
                data: service
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters = req.query || {};
            const result = await this.serviceService.getAll(filters);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Services fetched successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const service = await this.serviceService.getServiceById(req.params.id);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Service fetched successfully',
                data: service
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, type, latitude, longitude, address, description, transport } = req.body;
            const updateDto: ServiceUpdateRequestDto = { name, type, latitude, longitude, address, description, transport };
            const service = await this.serviceService.updateService(req.params.id, updateDto);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Service updated successfully',
                data: service
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deleted = await this.serviceService.deleteService(req.params.id);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Service deleted successfully',
                data: deleted
            });
        } catch (error) {
            next(error);
        }
    }

    async findNearbyServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { latitude, longitude, radius } = req.query;
            if (!latitude || !longitude || !radius) {
                sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'latitude, longitude, and radius are required',
                    data: null
                });
                return;
            }
            const latNum = Number(latitude);
            const lonNum = Number(longitude);
            const radiusNum = Number(radius);
            if (isNaN(latNum) || isNaN(lonNum) || isNaN(radiusNum) || radiusNum <= 0) {
                sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'latitude, longitude must be numbers and radius must be a positive number',
                    data: null
                });
                return;
            }
            const services = await this.serviceService.findNearbyServices(latNum, lonNum, radiusNum);
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Nearby services fetched successfully',
                data: services
            });
        } catch (error) {
            next(error);
        }
    }
}

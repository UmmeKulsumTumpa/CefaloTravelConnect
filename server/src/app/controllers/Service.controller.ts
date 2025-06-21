import type { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/Service.service.js';
import { validateService, validateServiceUpdate } from '../validations/Service.validation.js';
import sendResponse from '../utils/sendResponse.js';

export class ServiceController {
    constructor(private serviceService: ServiceService) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validation = validateService(req.body);
            if (!validation.valid) {
                sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: validation.errors.join(', '),
                    data: null as any
                });
                return;
            }
            const service = await this.serviceService.createService(req.body);
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

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validation = validateServiceUpdate(req.body);
            if (!validation.valid) {
                sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: validation.errors.join(', '),
                    data: null as any
                });
                return;
            }
            const service = await this.serviceService.updateService(req.params.id, req.body);
            if (!service) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Service not found',
                    data: null as any
                });
                return;
            }
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Service updated',
                data: service
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deleted = await this.serviceService.deleteService(req.params.id);
            if (!deleted) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Service not found',
                    data: null as any
                });
                return;
            }
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Service deleted',
                data: null as any
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const service = await this.serviceService.getServiceById(req.params.id);
            if (!service) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Service not found',
                    data: null as any
                });
                return;
            }
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
}

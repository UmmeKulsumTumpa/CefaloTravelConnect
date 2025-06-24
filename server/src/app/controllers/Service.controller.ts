import type { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/Service.service.js';
import sendResponse from '../utils/sendResponse.js';
import { ServiceCreateRequestDto, ServiceUpdateRequestDto } from '../dtos/ServiceDto.js';

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
}

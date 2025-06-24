import { Request, Response } from 'express';
import { TransportService } from '../services/Transport.service.js';
import sendResponse from '../utils/sendResponse.js';
import { TransportCreateDto, TransportUpdateDto } from '../dtos/TransportDto.js';

export class TransportController {
    constructor(private transportService: TransportService) {}

    async createTransport(req: Request, res: Response) {
        const transportData: TransportCreateDto = req.body;
        const transport = await this.transportService.createTransport(transportData);

        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Transport created successfully',
            data: transport,
        });
    }

    async getTransports(req: Request, res: Response) {
        const { service_id, mode, operator } = req.query;

        if (service_id) {
            const transport = await this.transportService.getTransportById(service_id as string);
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Transport fetched successfully',
                data: transport,
            });
        }

        if (mode || operator) {
            const transports = await this.transportService.searchTransports({ mode: mode as string, operator: operator as string });
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Transports fetched successfully',
                data: transports,
            });
        }

        const transports = await this.transportService.getAllTransports();

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Transports fetched successfully',
            data: transports,
        });
    }

    async updateTransport(req: Request, res: Response) {
        const { service_id } = req.params;
        const updateData: TransportUpdateDto = req.body;
        const transport = await this.transportService.updateTransport(service_id, updateData);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Transport updated successfully',
            data: transport,
        });
    }

    async deleteTransport(req: Request, res: Response) {
        const { service_id } = req.params;
        await this.transportService.deleteTransport(service_id);
        
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Transport deleted successfully',
            data: null,
        });
    }
}

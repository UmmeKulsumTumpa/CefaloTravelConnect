import { Request, Response, NextFunction } from 'express';
import { TravelPlanTransportService } from '../services/TravelPlanTransport.service.js';
import sendResponse from '../utils/sendResponse.js';
import type { AddPlanTransportDto } from '../dtos/TravelPlanDto.js';

export class TravelPlanTransportController {
    constructor(private travelPlanTransportService: TravelPlanTransportService) {}

    async addPlanTransport(req: Request, res: Response, next: NextFunction) {
        try {
            const plan_id = req.params.plan_id;
            if (!plan_id) {
                return sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'plan_id is required in the route',
                    data: null
                });
            }
            
            const addPlanTransportDto: AddPlanTransportDto = {
                ...req.body,
                plan_id
            };

            const transport = await this.travelPlanTransportService.addPlanTransport(addPlanTransportDto);

            sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Transport added to travel plan',
                data: transport
            });
        } catch (error) {
            next(error);
        }
    }

    async getPlanTransports(req: Request, res: Response, next: NextFunction) {
        try {
            const plan_id = req.params.plan_id;
            const transports = await this.travelPlanTransportService.getPlanTransports(plan_id);

            if (!transports || transports.length === 0) {
                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'No transports found for this travel plan',
                    data: null
                });
            }
            
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Transports fetched successfully',
                data: transports
            });
        } catch (error) {
            next(error);
        }
    }
}

import { Request, Response } from "express";
import { TravelPlanService } from "../services/TravelPlanService.service.js";
import { AddPlanServiceDto } from "../dtos/TravelPlanDto.js";
import sendResponse from "../utils/sendResponse.js";

export class TravelPlanServiceController {
    constructor(private travelPlanService: TravelPlanService) {}

    async addPlanService(req: Request, res: Response) {
        const userId = (req as any).user?.user_id;
        if (!userId) {
            return sendResponse(res, {
                statusCode: 401,
                success: false,
                message: "Unauthorized",
                data: null
            });
        }

        const plan_id = req.params.plan_id;
        const addPlanServiceDto: AddPlanServiceDto = {
            ...req.body,
            plan_id
        };

        const service = await this.travelPlanService.addPlanService(addPlanServiceDto);
        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Plan service added successfully",
            data: service
        });
    }

    async getPlanServices(req: Request, res: Response) {
        const services = await this.travelPlanService.getPlanServices(req.params.plan_id);

        if( !services || services.length === 0){
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "No services found for this plan",
                data: null
            });
        }

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Plan services retrieved successfully",
            data: services
        });
    }
}

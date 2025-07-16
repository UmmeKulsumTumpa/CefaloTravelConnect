import { Request, Response } from "express";
import { TravelPlanServices } from "../services/index.js";
import { TravelPlanServiceUnifiedDTO } from "../dtos/index.js";
import {sendResponse} from "../utils/index.js";

export class TravelPlanServiceController {
    constructor(private travelPlanService: TravelPlanServices) {}

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
        const addPlanServiceDto: TravelPlanServiceUnifiedDTO = {
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

        if (!services || services.length === 0) {
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

    async getPlanService(req: Request, res: Response) {
        const plan_id = req.params.plan_id;
        const service_id = req.params.service_id;
        const service = await this.travelPlanService.getPlanService(plan_id, service_id);
        if (!service) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Service not found",
                data: null
            });
        }
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Plan service retrieved successfully",
            data: service
        });
    }

    async updatePlanService(req: Request, res: Response) {
        const plan_id = req.params.plan_id;
        const service_id = req.params.service_id;
        const updateDto: TravelPlanServiceUnifiedDTO = { ...req.body, plan_id };
        const updated = await this.travelPlanService.updatePlanService(plan_id, service_id, updateDto);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Plan service updated successfully",
            data: updated
        });
    }

    async deletePlanService(req: Request, res: Response) {
        const plan_id = req.params.plan_id;
        const service_id = req.params.service_id;
        await this.travelPlanService.deletePlanService(plan_id, service_id);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Plan service deleted successfully",
            data: null
        });
    }
}

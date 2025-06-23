import { Request, Response } from "express";
import { TravelPlanPlaceService } from "../services/TravelPlanPlace.service.js";
import sendResponse from "../utils/sendResponse.js";

export class TravelPlanPlaceController {
    constructor(private travelPlanPlaceService: TravelPlanPlaceService) {}

    async addPlannedPlace(req: Request, res: Response) {
        const userId = (req as any).user?.user_id;
        if (!userId) {
            return sendResponse(res, {
                statusCode: 401,
                success: false,
                message: "Unauthorized",
                data: null
            });
        }
        const place = await this.travelPlanPlaceService.addPlannedPlace({ ...req.body, user_id: userId });
        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Planned place added successfully",
            data: place
        });
    }

    async getPlannedPlaces(req: Request, res: Response) {
        const places = await this.travelPlanPlaceService.getPlannedPlaces(req.params.plan_id);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Planned places retrieved successfully",
            data: places
        });
    }
}


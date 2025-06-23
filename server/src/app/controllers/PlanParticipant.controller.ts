import { Request, Response } from 'express';
import { TravelPlanService } from '../services/TravelPlan.service.js';
import sendResponse from '../utils/sendResponse.js';

export class PlanParticipantController {
    constructor(private travelPlanService: TravelPlanService) {}

    async addPlanParticipant(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.user_id;
            if (!userId) {
                return sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: 'Unauthorized',
                    data: null
                });
            }
            const participant = await this.travelPlanService.addPlanParticipant({ ...req.body }, userId);
            return sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Participant added successfully',
                data: participant
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: 500,
                success: false,
                message: 'Internal server error',
                data: (error as Error).message
            });
        }
    }

    async getPlanParticipants(req: Request, res: Response) {
        try {
            const participants = await this.travelPlanService.getPlanParticipants(req.params.plan_id);
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Participants fetched successfully',
                data: participants
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: 500,
                success: false,
                message: 'Internal server error',
                data: (error as Error).message
            });
        }
    }

    async updatePlanParticipant(req: Request, res: Response) {
        try {
            const requesterId = (req as any).user?.user_id;
            if (!requesterId) {
                return sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: 'Unauthorized',
                    data: null
                });
            }
            const { plan_id, user_id } = req.params;
            const numberUserId = parseInt(user_id, 10);
            const updated = await this.travelPlanService.updatePlanParticipant(plan_id, numberUserId, req.body, requesterId);
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Plan participant updated successfully',
                data: updated
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: (error as Error).message,
                data: null
            });
        }
    }

    async deletePlanParticipant(req: Request, res: Response) {
        try {
            const requesterId = (req as any).user?.user_id;
            if (!requesterId) {
                return sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: 'Unauthorized',
                    data: null
                });
            }
            const { plan_id, user_id } = req.params;
            const numberUserId = parseInt(user_id, 10);
            await this.travelPlanService.deletePlanParticipant(plan_id, numberUserId, requesterId);
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Plan participant deleted successfully',
                data: null
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: (error as Error).message,
                data: null
            });
        }
    }
}

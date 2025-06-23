import { Request, Response } from 'express';
import { TravelPlanService } from '../services/TravelPlan.service.js';
import sendResponse from '../utils/sendResponse.js';

export class TravelPlanController {
    constructor(private travelPlanService: TravelPlanService) {}

    async createTravelPlan(req: Request, res: Response) {
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
            const plan = await this.travelPlanService.createTravelPlan({ ...req.body });
            return sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Travel plan created successfully',
                data: plan
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

    async updateTravelPlan(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.user_id;
            const plan = await this.travelPlanService.getTravelPlanById(req.params.plan_id);
            if (!plan) {
                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Travel plan not found',
                    data: null
                });
            }
            const updated = await this.travelPlanService.updateTravelPlan(req.params.plan_id, req.body);
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Travel plan updated successfully',
                data: updated
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

    async getTravelPlanById(req: Request, res: Response) {
        try {
            const plan = await this.travelPlanService.getTravelPlanById(req.params.plan_id);
            if (!plan) {
                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Travel plan not found',
                    data: null
                });
            }
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Travel plan fetched successfully',
                data: plan
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

    async getAllTravelPlans(req: Request, res: Response) {
        try {
            const plans = await this.travelPlanService.getAllTravelPlans(req.query);
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Travel plans fetched successfully',
                data: plans
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

    async deleteTravelPlan(req: Request, res: Response) {
        try {
            const plan = await this.travelPlanService.getTravelPlanById(req.params.plan_id);
            if (!plan) {
                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Travel plan not found',
                    data: null
                });
            }
            await this.travelPlanService.deleteTravelPlan(req.params.plan_id);
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Travel plan deleted successfully',
                data: null
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

    // plan_participants methods
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
            const participant = await this.travelPlanService.addPlanParticipant({ ...req.body, user_id: userId });
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

    // plan_comments methods
    async addPlanComment(req: Request, res: Response) {
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
            const comment = await this.travelPlanService.addPlanComment({ ...req.body, user_id: userId });
            return sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Comment added successfully',
                data: comment
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

    async getPlanComments(req: Request, res: Response) {
        try {
            const comments = await this.travelPlanService.getPlanComments(req.params.plan_id);
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Comments fetched successfully',
                data: comments
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
}

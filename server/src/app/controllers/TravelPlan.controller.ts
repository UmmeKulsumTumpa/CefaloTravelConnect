import { Request, Response } from 'express';
import { TravelPlanService } from '../services/TravelPlan.service.js';
import sendResponse from '../utils/sendResponse.js';
import { validateCreateTravelPlan, validateUpdateTravelPlan } from '../validations/TravelPlan.validation.js';

export class TravelPlanController {
    constructor(private travelPlanService: TravelPlanService) {}

    async createTravelPlan(req: Request, res: Response) {
        try {
            let userId = (req as any).user?.user_id;
            if (!userId) {
                return sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: 'Unauthorized',
                    data: null
                });
            }
            userId = Number(userId);
            if (isNaN(userId)) {
                return sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'Invalid user_id',
                    data: null
                });
            }
            const errors = validateCreateTravelPlan(req.body);
            if (errors.length) {
                return sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'Validation error',
                    data: errors
                });
            }
            const plan = await this.travelPlanService.createTravelPlan({ ...req.body, user_id: userId });
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
            let userId = (req as any).user?.user_id;
            userId = Number(userId);
            if (isNaN(userId)) {
                return sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'Invalid user_id',
                    data: null
                });
            }
            const errors = validateUpdateTravelPlan(req.body);
            if (errors.length) {
                return sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'Validation error',
                    data: errors
                });
            }
            const plan = await this.travelPlanService.getTravelPlanById(req.params.plan_id);
            if (!plan) {
                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Travel plan not found',
                    data: null
                });
            }
            const updated = await this.travelPlanService.updateTravelPlan(req.params.plan_id, req.body, userId);
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
            // If user_id is present in query, cast to number
            const filters: any = { ...req.query };
            if (filters.user_id !== undefined) {
                filters.user_id = Number(filters.user_id);
                if (isNaN(filters.user_id)) {
                    return sendResponse(res, {
                        statusCode: 400,
                        success: false,
                        message: 'Invalid user_id in query',
                        data: null
                    });
                }
            }
            const plans = await this.travelPlanService.getAllTravelPlans(filters);
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
            let userId = (req as any).user?.user_id;
            userId = Number(userId);
            if (isNaN(userId)) {
                return sendResponse(res, {
                    statusCode: 400,
                    success: false,
                    message: 'Invalid user_id',
                    data: null
                });
            }
            const plan = await this.travelPlanService.getTravelPlanById(req.params.plan_id);
            if (!plan) {
                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: 'Travel plan not found',
                    data: null
                });
            }
            await this.travelPlanService.deleteTravelPlan(req.params.plan_id, userId);
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
            
            const comment = await this.travelPlanService.addPlanComment({ ...req.body, user_id: userId }, userId);
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

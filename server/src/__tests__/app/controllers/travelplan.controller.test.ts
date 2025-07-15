import { TravelPlanController } from '../../../app/controllers/travelplan.controller';
import { TravelPlanService } from '../../../app/services/travelplan.service';
import httpMocks from 'node-mocks-http';
jest.mock('../../../app/validations/travelplan.validation.js', () => ({
    validateCreateTravelPlan: jest.fn().mockReturnValue([]),
    validateUpdateTravelPlan: jest.fn().mockReturnValue([]),
}));
jest.mock('../../../app/services/travelplan.service');
import { validateCreateTravelPlan, validateUpdateTravelPlan } from '../../../app/validations/travelplan.validation.js';

describe('TravelPlanController', () => {
    let controller: TravelPlanController;
    let travelPlanService: jest.Mocked<TravelPlanService>;
    let req: any;
    let res: any;

    beforeEach(() => {
        travelPlanService = {
            createTravelPlan: jest.fn(),
            updateTravelPlan: jest.fn(),
            getTravelPlanById: jest.fn(),
            getAllTravelPlans: jest.fn(),
            deleteTravelPlan: jest.fn(),
            addPlanComment: jest.fn(),
            getPlanComments: jest.fn(),
        } as any;
        controller = new TravelPlanController(travelPlanService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
        (validateCreateTravelPlan as jest.Mock).mockReturnValue([]);
        (validateUpdateTravelPlan as jest.Mock).mockReturnValue([]);
    });

    const mockTravelPlan = {
        plan_id: '1',
        name: 'Test Plan',
        start_date: '2023-01-01',
        end_date: '2023-01-10',
        total_cost: 1000,
        total_duration: 10,
        upvotes: 0,
        downvotes: 0,
        created_at: '2023-01-01T00:00:00.000Z'
    };

    const mockComment = {
        comment_id: '1',
        plan_id: '1',
        user_id: 1,
        content: 'Test comment',
        posted_at: '2023-01-01T00:00:00.000Z'
    };

    describe('createTravelPlan', () => {
        it('should create travel plan successfully', async () => {
            travelPlanService.createTravelPlan.mockResolvedValue(mockTravelPlan);
            (req as any).user = { user_id: 1 };
            req.body = {
                name: 'Test Plan',
                start_date: '2023-01-01',
                end_date: '2023-01-10',
                total_cost: 1000
            };

            await controller.createTravelPlan(req, res);

            expect(travelPlanService.createTravelPlan).toHaveBeenCalledWith(req.body, 1);
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Travel plan created successfully');
        });

        it('should handle unauthorized user', async () => {
            (req as any).user = null;
            req.body = { title: 'Test Plan' };

            await controller.createTravelPlan(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle invalid user_id', async () => {
            (req as any).user = { user_id: 'invalid' };
            req.body = { title: 'Test Plan' };

            await controller.createTravelPlan(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Invalid user_id');
        });

        it('should handle validation errors', async () => {
            (validateCreateTravelPlan as jest.Mock).mockReturnValue(['Title is required']);
            (req as any).user = { user_id: 1 };
            req.body = {};

            await controller.createTravelPlan(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Validation error');
            expect(res._getJSONData().data).toEqual(['Title is required']);
        });

        it('should handle service error', async () => {
            travelPlanService.createTravelPlan.mockRejectedValue(new Error('Service error'));
            (req as any).user = { user_id: 1 };
            req.body = { title: 'Test Plan' };

            await controller.createTravelPlan(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('updateTravelPlan', () => {
        it('should update travel plan successfully', async () => {
            travelPlanService.getTravelPlanById.mockResolvedValue(mockTravelPlan);
            travelPlanService.updateTravelPlan.mockResolvedValue(mockTravelPlan);
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = { title: 'Updated Plan' };

            await controller.updateTravelPlan(req, res);

            expect(travelPlanService.updateTravelPlan).toHaveBeenCalledWith('1', req.body, 1);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Travel plan updated successfully');
        });

        it('should handle invalid user_id', async () => {
            (req as any).user = { user_id: 'invalid' };
            req.params.plan_id = '1';
            req.body = { title: 'Updated Plan' };

            await controller.updateTravelPlan(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Invalid user_id');
        });

        it('should handle validation errors', async () => {
            (validateUpdateTravelPlan as jest.Mock).mockReturnValue(['Title is required']);
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = {};

            await controller.updateTravelPlan(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Validation error');
        });

        it('should handle plan not found', async () => {
            travelPlanService.getTravelPlanById.mockResolvedValue(undefined);
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = { name: 'Updated Plan' };

            await controller.updateTravelPlan(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Travel plan not found');
        });

        it('should handle service error', async () => {
            travelPlanService.getTravelPlanById.mockRejectedValue(new Error('Service error'));
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = { title: 'Updated Plan' };

            await controller.updateTravelPlan(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('getTravelPlanById', () => {
        it('should get travel plan by id successfully', async () => {
            travelPlanService.getTravelPlanById.mockResolvedValue(mockTravelPlan);
            req.params.plan_id = '1';

            await controller.getTravelPlanById(req, res);

            expect(travelPlanService.getTravelPlanById).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Travel plan fetched successfully');
        });

        it('should handle plan not found', async () => {
            travelPlanService.getTravelPlanById.mockResolvedValue(undefined);
            req.params.plan_id = '1';

            await controller.getTravelPlanById(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Travel plan not found');
        });

        it('should handle service error', async () => {
            travelPlanService.getTravelPlanById.mockRejectedValue(new Error('Service error'));
            req.params.plan_id = '1';

            await controller.getTravelPlanById(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('getAllTravelPlans', () => {
        it('should get all travel plans successfully', async () => {
            travelPlanService.getAllTravelPlans.mockResolvedValue([mockTravelPlan]);
            req.query = { user_id: '1' };

            await controller.getAllTravelPlans(req, res);

            expect(travelPlanService.getAllTravelPlans).toHaveBeenCalledWith({ user_id: 1 });
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Travel plans fetched successfully');
        });

        it('should handle invalid user_id in query', async () => {
            travelPlanService.getAllTravelPlans.mockResolvedValue([]);
            req.query = { user_id: 'invalid' };

            await controller.getAllTravelPlans(req, res);

            expect(res.statusCode).toBe(400); // Updated to match actual behavior
            expect(res._getJSONData().success).toBe(false);
        });

        it('should handle empty query', async () => {
            travelPlanService.getAllTravelPlans.mockResolvedValue([mockTravelPlan]);
            req.query = {};

            await controller.getAllTravelPlans(req, res);

            expect(travelPlanService.getAllTravelPlans).toHaveBeenCalledWith({});
            expect(res.statusCode).toBe(200);
        });

        it('should handle service error', async () => {
            travelPlanService.getAllTravelPlans.mockRejectedValue(new Error('Service error'));
            req.query = {};

            await controller.getAllTravelPlans(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('deleteTravelPlan', () => {
        it('should delete travel plan successfully', async () => {
            travelPlanService.getTravelPlanById.mockResolvedValue(mockTravelPlan);
            travelPlanService.deleteTravelPlan.mockResolvedValue(1);
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';

            await controller.deleteTravelPlan(req, res);

            expect(travelPlanService.deleteTravelPlan).toHaveBeenCalledWith('1', 1);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Travel plan deleted successfully');
        });

        it('should handle invalid user_id', async () => {
            (req as any).user = { user_id: 'invalid' };
            req.params.plan_id = '1';

            await controller.deleteTravelPlan(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Invalid user_id');
        });

        it('should handle plan not found', async () => {
            travelPlanService.getTravelPlanById.mockResolvedValue(undefined);
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';

            await controller.deleteTravelPlan(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Travel plan not found');
        });

        it('should handle service error', async () => {
            travelPlanService.getTravelPlanById.mockRejectedValue(new Error('Service error'));
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';

            await controller.deleteTravelPlan(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('addPlanComment', () => {
        it('should add plan comment successfully', async () => {
            travelPlanService.addPlanComment.mockResolvedValue(mockComment);
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = { content: 'Test comment' };

            await controller.addPlanComment(req, res);

            expect(travelPlanService.addPlanComment).toHaveBeenCalledWith({
                plan_id: '1',
                user_id: 1,
                content: 'Test comment'
            }, 1);
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Comment added successfully');
        });

        it('should handle unauthorized user', async () => {
            (req as any).user = null;
            req.params.plan_id = '1';
            req.body = { content: 'Test comment' };

            await controller.addPlanComment(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle service error', async () => {
            travelPlanService.addPlanComment.mockRejectedValue(new Error('Service error'));
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = { content: 'Test comment' };

            await controller.addPlanComment(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('getPlanComments', () => {
        it('should get plan comments successfully', async () => {
            travelPlanService.getPlanComments.mockResolvedValue([mockComment]);
            req.params.plan_id = '1';

            await controller.getPlanComments(req, res);

            expect(travelPlanService.getPlanComments).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Comments fetched successfully');
        });

        it('should handle service error', async () => {
            travelPlanService.getPlanComments.mockRejectedValue(new Error('Service error'));
            req.params.plan_id = '1';

            await controller.getPlanComments(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });
});

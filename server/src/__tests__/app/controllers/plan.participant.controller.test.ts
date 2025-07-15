import { PlanParticipantController } from '../../../app/controllers/plan.participant.controller';
import { TravelPlanService } from '../../../app/services/travelplan.service';
import httpMocks from 'node-mocks-http';
import type { AddPlanParticipantDto } from '../../../app/dtos/travelPlanDto';

describe('PlanParticipantController', () => {
    let travelPlanService: jest.Mocked<TravelPlanService>;
    let controller: PlanParticipantController;
    let req: any, res: any;

    beforeEach(() => {
        travelPlanService = {
            addPlanParticipant: jest.fn(),
            getPlanParticipants: jest.fn(),
            updatePlanParticipant: jest.fn(),
            deletePlanParticipant: jest.fn(),
        } as any;
        controller = new PlanParticipantController(travelPlanService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    const mockParticipant = {
        plan_id: '1',
        user_id: 1,
        is_going: true,
        role_permission: 'Owner' as const,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
    };

    describe('addPlanParticipant', () => {
        it('should add participant successfully', async () => {
            travelPlanService.addPlanParticipant.mockResolvedValue(mockParticipant);
            req.params.plan_id = '1';
            req.body = { user_id: 1, is_going: true, role_permission: 'participant' };
            (req as any).user = { user_id: 1 };

            await controller.addPlanParticipant(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Participant added successfully');
        });

        it('should handle unauthorized user', async () => {
            req.params.plan_id = '1';
            req.body = { user_id: 1, is_going: true, role_permission: 'participant' };
            (req as any).user = null;

            await controller.addPlanParticipant(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle user without user_id', async () => {
            req.params.plan_id = '1';
            req.body = { user_id: 1, is_going: true, role_permission: 'participant' };
            (req as any).user = {};

            await controller.addPlanParticipant(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle service error', async () => {
            travelPlanService.addPlanParticipant.mockRejectedValue(new Error('Service error'));
            req.params.plan_id = '1';
            req.body = { user_id: 1, is_going: true, role_permission: 'participant' };
            (req as any).user = { user_id: 1 };

            await controller.addPlanParticipant(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('getPlanParticipants', () => {
        it('should get participants successfully', async () => {
            travelPlanService.getPlanParticipants.mockResolvedValue([mockParticipant]);
            req.params.plan_id = '1';

            await controller.getPlanParticipants(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Participants fetched successfully');
        });

        it('should handle service error', async () => {
            travelPlanService.getPlanParticipants.mockRejectedValue(new Error('Service error'));
            req.params.plan_id = '1';

            await controller.getPlanParticipants(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Internal server error');
        });
    });

    describe('updatePlanParticipant', () => {
        it('should update participant successfully', async () => {
            travelPlanService.updatePlanParticipant.mockResolvedValue(mockParticipant);
            req.params.plan_id = '1';
            req.params.user_id = '1';
            req.body = { is_going: false };
            (req as any).user = { user_id: 1 };

            await controller.updatePlanParticipant(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Plan participant updated successfully');
        });

        it('should handle unauthorized user', async () => {
            req.params.plan_id = '1';
            req.params.user_id = '1';
            req.body = { is_going: false };
            (req as any).user = null;

            await controller.updatePlanParticipant(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle service error', async () => {
            travelPlanService.updatePlanParticipant.mockRejectedValue(new Error('Forbidden'));
            req.params.plan_id = '1';
            req.params.user_id = '1';
            req.body = { is_going: false };
            (req as any).user = { user_id: 1 };

            await controller.updatePlanParticipant(req, res);

            expect(res.statusCode).toBe(403);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Forbidden');
        });
    });

    describe('deletePlanParticipant', () => {
        it('should delete participant successfully', async () => {
            travelPlanService.deletePlanParticipant.mockResolvedValue(1);
            req.params.plan_id = '1';
            req.params.user_id = '1';
            (req as any).user = { user_id: 1 };

            await controller.deletePlanParticipant(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Plan participant deleted successfully');
        });

        it('should handle unauthorized user', async () => {
            req.params.plan_id = '1';
            req.params.user_id = '1';
            (req as any).user = null;

            await controller.deletePlanParticipant(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle service error', async () => {
            travelPlanService.deletePlanParticipant.mockRejectedValue(new Error('Forbidden'));
            req.params.plan_id = '1';
            req.params.user_id = '1';
            (req as any).user = { user_id: 1 };

            await controller.deletePlanParticipant(req, res);

            expect(res.statusCode).toBe(403);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Forbidden');
        });
    });
});

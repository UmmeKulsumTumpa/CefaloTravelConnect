import { TravelPlanServiceController } from '../../../app/controllers/travelplan.service.controller';
import { TravelPlanService } from '../../../app/services/travelplan.service.service';
import httpMocks from 'node-mocks-http';
import type { TravelPlanServiceUnifiedDTO } from '../../../app/dtos/travelPlanDto';

describe('TravelPlanServiceController', () => {
    let travelPlanService: jest.Mocked<TravelPlanService>;
    let controller: TravelPlanServiceController;
    let req: any, res: any;

    beforeEach(() => {
        travelPlanService = {
            addPlanService: jest.fn(),
            getPlanServices: jest.fn(),
            getPlanService: jest.fn(),
            updatePlanService: jest.fn(),
            deletePlanService: jest.fn(),
        } as any;
        controller = new TravelPlanServiceController(travelPlanService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    const mockPlanService = {
        plan_id: '1',
        service_id: '1',
        estimated_cost: 100,
        planned_visit_date: '2023-01-01T00:00:00.000Z',
        notes: 'Test notes',
        notify_when_near: false,
        created_at: '2023-01-01T00:00:00.000Z'
    };

    describe('addPlanService', () => {
        it('should add plan service successfully', async () => {
            travelPlanService.addPlanService.mockResolvedValue(mockPlanService);
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = {
                service_id: '1',
                notes: 'Test notes'
            };

            await controller.addPlanService(req, res);

            expect(travelPlanService.addPlanService).toHaveBeenCalledWith({
                ...req.body,
                plan_id: '1'
            });
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Plan service added successfully');
            expect(res._getJSONData().data).toEqual(mockPlanService);
        });

        it('should handle unauthorized user', async () => {
            (req as any).user = null;
            req.params.plan_id = '1';
            req.body = {
                service_id: '1',
                notes: 'Test notes'
            };

            await controller.addPlanService(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle user without user_id', async () => {
            (req as any).user = {};
            req.params.plan_id = '1';
            req.body = {
                service_id: '1',
                notes: 'Test notes'
            };

            await controller.addPlanService(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle service error', async () => {
            travelPlanService.addPlanService.mockRejectedValue(new Error('Service error'));
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = {
                service_id: '1',
                notes: 'Test notes'
            };

            await expect(controller.addPlanService(req, res)).rejects.toThrow('Service error');
        });
    });

    describe('getPlanServices', () => {
        it('should get plan services successfully', async () => {
            travelPlanService.getPlanServices.mockResolvedValue([mockPlanService]);
            req.params.plan_id = '1';

            await controller.getPlanServices(req, res);

            expect(travelPlanService.getPlanServices).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Plan services retrieved successfully');
            expect(res._getJSONData().data).toEqual([mockPlanService]);
        });

        it('should handle no services found', async () => {
            travelPlanService.getPlanServices.mockResolvedValue([]);
            req.params.plan_id = '1';

            await controller.getPlanServices(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('No services found for this plan');
            expect(res._getJSONData().data).toBeNull();
        });

        it('should handle empty services array', async () => {
            travelPlanService.getPlanServices.mockResolvedValue([]);
            req.params.plan_id = '1';

            await controller.getPlanServices(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('No services found for this plan');
            expect(res._getJSONData().data).toBeNull();
        });

        it('should handle service error', async () => {
            travelPlanService.getPlanServices.mockRejectedValue(new Error('Service error'));
            req.params.plan_id = '1';

            await expect(controller.getPlanServices(req, res)).rejects.toThrow('Service error');
        });
    });

    describe('getPlanService', () => {
        it('should get plan service successfully', async () => {
            travelPlanService.getPlanService.mockResolvedValue(mockPlanService);
            req.params.plan_id = '1';
            req.params.service_id = '1';

            await controller.getPlanService(req, res);

            expect(travelPlanService.getPlanService).toHaveBeenCalledWith('1', '1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Plan service retrieved successfully');
            expect(res._getJSONData().data).toEqual(mockPlanService);
        });

        it('should handle service not found', async () => {
            travelPlanService.getPlanService.mockResolvedValue(null);
            req.params.plan_id = '1';
            req.params.service_id = '1';

            await controller.getPlanService(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Service not found');
            expect(res._getJSONData().data).toBeNull();
        });

        it('should handle service error', async () => {
            travelPlanService.getPlanService.mockRejectedValue(new Error('Service error'));
            req.params.plan_id = '1';
            req.params.service_id = '1';

            await expect(controller.getPlanService(req, res)).rejects.toThrow('Service error');
        });
    });

    describe('updatePlanService', () => {
        it('should update plan service successfully', async () => {
            const updatedService = { ...mockPlanService, notes: 'Updated notes' };
            travelPlanService.updatePlanService.mockResolvedValue(updatedService);
            req.params.plan_id = '1';
            req.params.service_id = '1';
            req.body = { notes: 'Updated notes' };

            await controller.updatePlanService(req, res);

            expect(travelPlanService.updatePlanService).toHaveBeenCalledWith('1', '1', {
                ...req.body,
                plan_id: '1'
            });
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Plan service updated successfully');
            expect(res._getJSONData().data).toEqual(updatedService);
        });

        it('should handle service error', async () => {
            travelPlanService.updatePlanService.mockRejectedValue(new Error('Service error'));
            req.params.plan_id = '1';
            req.params.service_id = '1';
            req.body = { notes: 'Updated notes' };

            await expect(controller.updatePlanService(req, res)).rejects.toThrow('Service error');
        });
    });

    describe('deletePlanService', () => {
        it('should delete plan service successfully', async () => {
            travelPlanService.deletePlanService.mockResolvedValue(undefined);
            req.params.plan_id = '1';
            req.params.service_id = '1';

            await controller.deletePlanService(req, res);

            expect(travelPlanService.deletePlanService).toHaveBeenCalledWith('1', '1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Plan service deleted successfully');
            expect(res._getJSONData().data).toBeNull();
        });

        it('should handle service error', async () => {
            travelPlanService.deletePlanService.mockRejectedValue(new Error('Service error'));
            req.params.plan_id = '1';
            req.params.service_id = '1';

            await expect(controller.deletePlanService(req, res)).rejects.toThrow('Service error');
        });
    });
});

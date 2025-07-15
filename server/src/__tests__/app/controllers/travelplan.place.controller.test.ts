import { TravelPlanPlaceController } from '../../../app/controllers/travelplan.place.controller';
import { TravelPlanPlaceService } from '../../../app/services/travelplan.place.service';
import httpMocks from 'node-mocks-http';
import type { AddPlannedPlaceDto } from '../../../app/dtos/travelPlanDto';

describe('TravelPlanPlaceController', () => {
    let travelPlanPlaceService: jest.Mocked<TravelPlanPlaceService>;
    let controller: TravelPlanPlaceController;
    let req: any, res: any;

    beforeEach(() => {
        travelPlanPlaceService = {
            addPlannedPlace: jest.fn(),
            getPlannedPlaces: jest.fn(),
        } as any;
        controller = new TravelPlanPlaceController(travelPlanPlaceService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    const mockPlannedPlace = {
        plan_id: '1',
        place_id: '1',
        priority: 'MustVisit' as const,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
    };

    describe('addPlannedPlace', () => {
        it('should add planned place successfully', async () => {
            travelPlanPlaceService.addPlannedPlace.mockResolvedValue(mockPlannedPlace);
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = {
                place_id: '1',
                priority: 'High'
            };

            await controller.addPlannedPlace(req, res);

            expect(travelPlanPlaceService.addPlannedPlace).toHaveBeenCalledWith({
                ...req.body,
                plan_id: '1'
            });
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Planned place added successfully');
            expect(res._getJSONData().data).toEqual(mockPlannedPlace);
        });

        it('should handle unauthorized user', async () => {
            (req as any).user = null;
            req.params.plan_id = '1';
            req.body = {
                place_id: '1',
                planned_date: new Date(),
                notes: 'Test notes'
            };

            await controller.addPlannedPlace(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle user without user_id', async () => {
            (req as any).user = {};
            req.params.plan_id = '1';
            req.body = {
                place_id: '1',
                planned_date: new Date(),
                notes: 'Test notes'
            };

            await controller.addPlannedPlace(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('Unauthorized');
        });

        it('should handle service error', async () => {
            travelPlanPlaceService.addPlannedPlace.mockRejectedValue(new Error('Service error'));
            (req as any).user = { user_id: 1 };
            req.params.plan_id = '1';
            req.body = {
                place_id: '1',
                planned_date: new Date(),
                notes: 'Test notes'
            };

            await expect(controller.addPlannedPlace(req, res)).rejects.toThrow('Service error');
        });
    });

    describe('getPlannedPlaces', () => {
        it('should get planned places successfully', async () => {
            travelPlanPlaceService.getPlannedPlaces.mockResolvedValue([mockPlannedPlace]);
            req.params.plan_id = '1';

            await controller.getPlannedPlaces(req, res);

            expect(travelPlanPlaceService.getPlannedPlaces).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Planned places retrieved successfully');
            expect(res._getJSONData().data).toEqual([mockPlannedPlace]);
        });

        it('should handle service error', async () => {
            travelPlanPlaceService.getPlannedPlaces.mockRejectedValue(new Error('Service error'));
            req.params.plan_id = '1';

            await expect(controller.getPlannedPlaces(req, res)).rejects.toThrow('Service error');
        });

        it('should handle empty result', async () => {
            travelPlanPlaceService.getPlannedPlaces.mockResolvedValue([]);
            req.params.plan_id = '1';

            await controller.getPlannedPlaces(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Planned places retrieved successfully');
            expect(res._getJSONData().data).toEqual([]);
        });
    });
});

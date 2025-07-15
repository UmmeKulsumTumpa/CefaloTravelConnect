import { TravelPlanService } from '../../../app/services/travelplan.service.service';

jest.mock('../../../app/validations/travelplan.validation', () => ({
    validatePlanService: jest.fn(() => []),
    validatePlanTransport: jest.fn(() => []),
}));

const { validatePlanService, validatePlanTransport } = require('../../../app/validations/travelplan.validation');

describe('TravelPlanService (plan service)', () => {
    let repo: any;
    let svc: TravelPlanService;

    beforeEach(() => {
        repo = {
            getTravelPlanById: jest.fn(),
            addPlanService: jest.fn(),
            addPlanTransport: jest.fn(),
            getPlanService: jest.fn(),
            getPlanTransport: jest.fn(),
            updatePlanService: jest.fn(),
            updatePlanTransport: jest.fn(),
            deletePlanService: jest.fn(),
            deletePlanTransport: jest.fn(),
            getPlanServices: jest.fn(),
            getPlanTransports: jest.fn(),
        };
        svc = new TravelPlanService(repo);
        (validatePlanService as jest.Mock).mockReturnValue([]);
        (validatePlanTransport as jest.Mock).mockReturnValue([]);
    });

    describe('addPlanService', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.addPlanService({ plan_id: '1' } as any)).rejects.toThrow('Travel plan not found');
        });
        it('throws if service validation fails', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            (validatePlanService as jest.Mock).mockReturnValue(['bad']);
            await expect(svc.addPlanService({ plan_id: '1' } as any)).rejects.toThrow('bad');
        });
        it('throws if transport validation fails', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            (validatePlanService as jest.Mock).mockReturnValue([]);
            (validatePlanTransport as jest.Mock).mockReturnValue(['bad2']);
            const data = { plan_id: '1', transport_details: { planned_departure_time: 1 } } as any;
            repo.addPlanService.mockResolvedValue({ service_id: 's1' });
            await expect(svc.addPlanService(data)).rejects.toThrow('bad2');
        });
        it('calls repo.addPlanService and addPlanTransport, returns merged result', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            (validatePlanService as jest.Mock).mockReturnValue([]);
            (validatePlanTransport as jest.Mock).mockReturnValue([]);
            const data = { plan_id: '1', transport_details: { planned_departure_time: 1 } } as any;
            repo.addPlanService.mockResolvedValue({ service_id: 's1' });
            repo.addPlanTransport.mockResolvedValue({ planned_departure_time: 1 });
            const result = await svc.addPlanService(data);
            expect(result.transport_details).toEqual({ planned_departure_time: 1 });
        });
    });

    describe('getPlanService', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.getPlanService('p1', 's1')).rejects.toThrow('Travel plan not found');
        });
        it('throws if service not found', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanService.mockResolvedValue(null);
            await expect(svc.getPlanService('p1', 's1')).rejects.toThrow('Service not found');
        });
        it('calls repo.getPlanService and getPlanTransport, returns merged result', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanService.mockResolvedValue({ service_id: 's1' });
            repo.getPlanTransport.mockResolvedValue({ planned_departure_time: 1 });
            const result = await svc.getPlanService('p1', 's1');
            expect(result).not.toBeNull();
            expect(result!.transport_details).toEqual({ planned_departure_time: 1 });
        });
    });

    describe('updatePlanService', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.updatePlanService('p1', 's1', {} as any)).rejects.toThrow('Travel plan not found');
        });
        it('throws if service not found', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanService.mockResolvedValue(null);
            await expect(svc.updatePlanService('p1', 's1', {} as any)).rejects.toThrow('Service not found');
        });
        it('throws if service validation fails', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanService.mockResolvedValue({});
            (validatePlanService as jest.Mock).mockReturnValue(['bad']);
            await expect(svc.updatePlanService('p1', 's1', {} as any)).rejects.toThrow('bad');
        });
        it('throws if transport validation fails', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanService.mockResolvedValue({});
            (validatePlanService as jest.Mock).mockReturnValue([]);
            (validatePlanTransport as jest.Mock).mockReturnValue(['bad2']);
            const data = { transport_details: { planned_departure_time: 1 } } as any;
            await expect(svc.updatePlanService('p1', 's1', data)).rejects.toThrow('bad2');
        });
        it('calls repo.updatePlanService and updatePlanTransport, returns merged result', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanService.mockResolvedValue({});
            (validatePlanService as jest.Mock).mockReturnValue([]);
            (validatePlanTransport as jest.Mock).mockReturnValue([]);
            repo.updatePlanService.mockResolvedValue({ service_id: 's1' });
            repo.updatePlanTransport.mockResolvedValue({ planned_departure_time: 1 });
            const data = { transport_details: { planned_departure_time: 1 } } as any;
            const result = await svc.updatePlanService('p1', 's1', data);
            expect(result.transport_details).toEqual({ planned_departure_time: 1 });
        });
    });

    describe('deletePlanService', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.deletePlanService('p1', 's1')).rejects.toThrow('Travel plan not found');
        });
        it('throws if service not found', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanService.mockResolvedValue(null);
            await expect(svc.deletePlanService('p1', 's1')).rejects.toThrow('Service not found');
        });
        it('calls repo.deletePlanService and deletePlanTransport', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanService.mockResolvedValue({});
            repo.deletePlanService.mockResolvedValue();
            repo.deletePlanTransport.mockResolvedValue();
            await expect(svc.deletePlanService('p1', 's1')).resolves.toBeUndefined();
        });
    });

    describe('getPlanServices', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.getPlanServices('p1')).rejects.toThrow('Travel plan not found');
        });
        it('calls repo.getPlanServices and getPlanTransports, returns merged results', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanServices.mockResolvedValue([{ service_id: 's1' }]);
            repo.getPlanTransports.mockResolvedValue([{ service_id: 's1', planned_departure_time: 1 }]);
            const result = await svc.getPlanServices('p1');
            expect(result[0].transport_details).toEqual({ service_id: 's1', planned_departure_time: 1 });
        });
    });
});

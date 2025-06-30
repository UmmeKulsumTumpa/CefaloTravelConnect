import { TravelPlanTransportService } from '../../../app/services/TravelPlanTransport.service';

describe('TravelPlanTransportService', () => {
    let repo: any;
    let svc: TravelPlanTransportService;

    beforeEach(() => {
        repo = {
            getTravelPlanById: jest.fn(),
            addPlanTransport: jest.fn(),
            getPlanTransport: jest.fn(),
            updatePlanTransport: jest.fn(),
            deletePlanTransport: jest.fn(),
            getPlanTransports: jest.fn(),
        };
        svc = new TravelPlanTransportService(repo);
    });

    describe('addPlanTransport', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.addPlanTransport({ plan_id: '1' } as any)).rejects.toThrow('Travel plan not found');
        });
        it('calls repo.addPlanTransport and returns result', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.addPlanTransport.mockResolvedValue({ transport_id: 't1' });
            const result = await svc.addPlanTransport({ plan_id: '1' } as any);
            expect(result).toEqual({ transport_id: 't1' });
        });
    });

    describe('getPlanTransport', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.getPlanTransport('p1', 's1')).rejects.toThrow('Travel plan not found');
        });
        it('throws if transport not found', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanTransport.mockResolvedValue(null);
            await expect(svc.getPlanTransport('p1', 's1')).rejects.toThrow('Transport not found');
        });
        it('calls repo.getPlanTransport and returns result', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanTransport.mockResolvedValue({ transport_id: 't1' });
            const result = await svc.getPlanTransport('p1', 's1');
            expect(result).toEqual({ transport_id: 't1' });
        });
    });

    describe('updatePlanTransport', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.updatePlanTransport('p1', 's1', {} as any)).rejects.toThrow('Travel plan not found');
        });
        it('throws if transport not found', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanTransport.mockResolvedValue(null);
            await expect(svc.updatePlanTransport('p1', 's1', {} as any)).rejects.toThrow('Transport not found');
        });
        it('calls repo.updatePlanTransport and returns result', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanTransport.mockResolvedValue({});
            repo.updatePlanTransport.mockResolvedValue({ transport_id: 't1' });
            const result = await svc.updatePlanTransport('p1', 's1', {} as any);
            expect(result).toEqual({ transport_id: 't1' });
        });
    });

    describe('deletePlanTransport', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.deletePlanTransport('p1', 's1')).rejects.toThrow('Travel plan not found');
        });
        it('throws if transport not found', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanTransport.mockResolvedValue(null);
            await expect(svc.deletePlanTransport('p1', 's1')).rejects.toThrow('Transport not found');
        });
        it('calls repo.deletePlanTransport and returns result', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanTransport.mockResolvedValue({});
            repo.deletePlanTransport.mockResolvedValue(1);
            const result = await svc.deletePlanTransport('p1', 's1');
            expect(result).toBe(1);
        });
    });

    describe('getPlanTransports', () => {
        it('throws if plan not found', async () => {
            repo.getTravelPlanById.mockResolvedValue(null);
            await expect(svc.getPlanTransports('p1')).rejects.toThrow('Travel plan not found');
        });
        it('calls repo.getPlanTransports and returns result', async () => {
            repo.getTravelPlanById.mockResolvedValue({});
            repo.getPlanTransports.mockResolvedValue([{ transport_id: 't1' }]);
            const result = await svc.getPlanTransports('p1');
            expect(result).toEqual([{ transport_id: 't1' }]);
        });
    });
});

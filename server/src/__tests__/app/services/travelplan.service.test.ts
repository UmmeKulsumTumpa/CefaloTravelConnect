import { TravelPlanService } from '../../../app/services/TravelPlan.service';

describe('TravelPlanService', () => {
    let repo: any;
    let userService: any;
    let svc: TravelPlanService;

    beforeEach(() => {
        repo = {
            createTravelPlan: jest.fn(),
            addPlanParticipant: jest.fn(),
            getPlanParticipant: jest.fn(),
            updateTravelPlan: jest.fn(),
            deleteTravelPlan: jest.fn(),
            getTravelPlanById: jest.fn(),
            getAllTravelPlans: jest.fn(),
            addPlanComment: jest.fn(),
            getPlanComments: jest.fn(),
            getPlanParticipants: jest.fn(),
            updatePlanParticipant: jest.fn(),
            deletePlanParticipant: jest.fn(),
        };
        userService = { getUsers: jest.fn() };
        svc = new TravelPlanService(repo, userService);
    });

    it('createTravelPlan calls repo.createTravelPlan and addPlanParticipant, returns plan', async () => {
        repo.createTravelPlan.mockResolvedValue({ plan_id: '1' });
        repo.addPlanParticipant.mockResolvedValue({});
        const result = await svc.createTravelPlan({} as any, 2);
        expect(repo.createTravelPlan).toHaveBeenCalled();
        expect(repo.addPlanParticipant).toHaveBeenCalledWith({ plan_id: '1', user_id: 2, role_permission: 'Owner', is_going: true });
        expect(result).toEqual({ plan_id: '1' });
    });

    describe('updateTravelPlan', () => {
        it('throws if not owner', async () => {
            repo.getPlanParticipant.mockResolvedValue({ role_permission: 'Editor' });
            await expect(svc.updateTravelPlan('1', {} as any, 2)).rejects.toThrow('Forbidden');
        });
        it('calls repo.updateTravelPlan and returns result', async () => {
            repo.getPlanParticipant.mockResolvedValue({ role_permission: 'Owner' });
            repo.updateTravelPlan.mockResolvedValue({ plan_id: '1' });
            const result = await svc.updateTravelPlan('1', {} as any, 2);
            expect(result).toEqual({ plan_id: '1' });
        });
    });

    describe('deleteTravelPlan', () => {
        it('throws if not owner', async () => {
            repo.getPlanParticipant.mockResolvedValue({ role_permission: 'Editor' });
            await expect(svc.deleteTravelPlan('1', 2)).rejects.toThrow('Forbidden');
        });
        it('calls repo.deleteTravelPlan and returns result', async () => {
            repo.getPlanParticipant.mockResolvedValue({ role_permission: 'Owner' });
            repo.deleteTravelPlan.mockResolvedValue(1);
            const result = await svc.deleteTravelPlan('1', 2);
            expect(result).toBe(1);
        });
    });

    it('getTravelPlanById calls repo.getTravelPlanById and returns result', async () => {
        repo.getTravelPlanById.mockResolvedValue({ plan_id: '1' });
        const result = await svc.getTravelPlanById('1');
        expect(result).toEqual({ plan_id: '1' });
    });

    it('getAllTravelPlans calls repo.getAllTravelPlans and returns result', async () => {
        repo.getAllTravelPlans.mockResolvedValue([{ plan_id: '1' }]);
        const result = await svc.getAllTravelPlans({});
        expect(result).toEqual([{ plan_id: '1' }]);
    });

    describe('addPlanParticipant', () => {
        it('throws if not owner/editor', async () => {
            repo.getPlanParticipant.mockResolvedValue({ role_permission: 'Viewer' });
            await expect(svc.addPlanParticipant({ plan_id: '1', user_id: 3 } as any, { user_id: 2 })).rejects.toThrow('Forbidden');
        });
        it('throws if participant already exists', async () => {
            repo.getPlanParticipant
                .mockResolvedValueOnce({ role_permission: 'Owner' })
                .mockResolvedValueOnce({});
            await expect(svc.addPlanParticipant({ plan_id: '1', user_id: 3 } as any, { user_id: 2 })).rejects.toThrow('Participant already exists');
        });
        it('calls repo.addPlanParticipant and returns result', async () => {
            repo.getPlanParticipant
                .mockResolvedValueOnce({ role_permission: 'Owner' })
                .mockResolvedValueOnce(null);
            repo.addPlanParticipant.mockResolvedValue({});
            const result = await svc.addPlanParticipant({ plan_id: '1', user_id: 3 } as any, { user_id: 2 });
            expect(result).toEqual({});
        });
    });

    it('getPlanParticipants calls repo.getPlanParticipants and returns result', async () => {
        repo.getPlanParticipants.mockResolvedValue([{ user_id: 2 }]);
        const result = await svc.getPlanParticipants('1');
        expect(result).toEqual([{ user_id: 2 }]);
    });

    describe('updatePlanParticipant', () => {
        it('throws if not owner', async () => {
            repo.getPlanParticipant.mockResolvedValueOnce({ role_permission: 'Editor' });
            await expect(svc.updatePlanParticipant('1', 3, {}, 2)).rejects.toThrow('Forbidden');
        });
        it('throws if participant not found', async () => {
            repo.getPlanParticipant.mockResolvedValueOnce({ role_permission: 'Owner' }).mockResolvedValueOnce(null);
            await expect(svc.updatePlanParticipant('1', 3, {}, 2)).rejects.toThrow('Participant not found');
        });
        it('calls repo.updatePlanParticipant and returns result', async () => {
            repo.getPlanParticipant.mockResolvedValueOnce({ role_permission: 'Owner' }).mockResolvedValueOnce({});
            repo.updatePlanParticipant.mockResolvedValue({});
            const result = await svc.updatePlanParticipant('1', 3, {}, 2);
            expect(result).toEqual({});
        });
    });

    describe('deletePlanParticipant', () => {
        it('throws if not owner', async () => {
            repo.getPlanParticipant.mockResolvedValueOnce({ role_permission: 'Editor' });
            await expect(svc.deletePlanParticipant('1', 3, 2)).rejects.toThrow('Forbidden');
        });
        it('throws if participant not found', async () => {
            repo.getPlanParticipant.mockResolvedValueOnce({ role_permission: 'Owner' }).mockResolvedValueOnce(null);
            await expect(svc.deletePlanParticipant('1', 3, 2)).rejects.toThrow('Participant not found');
        });
        it('calls repo.deletePlanParticipant and returns result', async () => {
            repo.getPlanParticipant.mockResolvedValueOnce({ role_permission: 'Owner' }).mockResolvedValueOnce({});
            repo.deletePlanParticipant.mockResolvedValue(1);
            const result = await svc.deletePlanParticipant('1', 3, 2);
            expect(result).toBe(1);
        });
    });

    describe('addPlanComment', () => {
        it('throws if not owner/editor', async () => {
            repo.getPlanParticipant.mockResolvedValue({ role_permission: 'Viewer' });
            await expect(svc.addPlanComment({ plan_id: '1' } as any, 2)).rejects.toThrow('Forbidden');
        });
        it('calls repo.addPlanComment and returns result', async () => {
            repo.getPlanParticipant.mockResolvedValue({ role_permission: 'Owner' });
            repo.addPlanComment.mockResolvedValue({ comment_id: 'c1' });
            const result = await svc.addPlanComment({ plan_id: '1' } as any, 2);
            expect(result).toEqual({ comment_id: 'c1' });
        });
    });

    it('getPlanComments calls repo.getPlanComments and returns result', async () => {
        repo.getPlanComments.mockResolvedValue([{ comment_id: 'c1' }]);
        const result = await svc.getPlanComments('1');
        expect(result).toEqual([{ comment_id: 'c1' }]);
    });
});

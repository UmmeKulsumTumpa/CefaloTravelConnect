import { TravelPlanPlaceService } from '../../../app/services/travelplan.place.service';

describe('TravelPlanPlaceService', () => {
    let repo: any;
    let svc: TravelPlanPlaceService;

    beforeEach(() => {
        repo = {
            addPlannedPlace: jest.fn(),
            getPlannedPlaces: jest.fn(),
        };
        svc = new TravelPlanPlaceService(repo);
    });

    it('addPlannedPlace calls repo.addPlannedPlace and returns result', async () => {
        repo.addPlannedPlace.mockResolvedValue({ place_id: 'p1' });
        const result = await svc.addPlannedPlace({} as any);
        expect(repo.addPlannedPlace).toHaveBeenCalled();
        expect(result).toEqual({ place_id: 'p1' });
    });

    it('getPlannedPlaces calls repo.getPlannedPlaces and returns result', async () => {
        repo.getPlannedPlaces.mockResolvedValue([{ place_id: 'p1' }]);
        const result = await svc.getPlannedPlaces('plan1');
        expect(repo.getPlannedPlaces).toHaveBeenCalledWith('plan1');
        expect(result).toEqual([{ place_id: 'p1' }]);
    });
});

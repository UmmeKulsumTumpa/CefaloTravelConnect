import { PlaceController } from '../../../app/controllers/place.controller';
import type { PlaceDto } from '../../../app/dtos/placeDto';
import { PlaceService } from '../../../app/services/place.service';
import httpMocks from 'node-mocks-http';

describe('PlaceController', () => {
	let placeService: jest.Mocked<PlaceService>;
	let controller: PlaceController;
	let req: any, res: any, next: any;

	beforeEach(() => {
		placeService = {
			createPlace: jest.fn(),
			getAllPlaces: jest.fn(),
			getPlaceById: jest.fn(),
			updatePlace: jest.fn(),
			deletePlace: jest.fn(),
		} as any;
		controller = new PlaceController(placeService);
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
		next = jest.fn();
	});

	it('should create place successfully', async () => {
		const mockPlace: PlaceDto = {
			place_id: '1',
			name: 'Test Place',
			latitude: 0,
			longitude: 0,
			address: 'Test Address',
			notes: 'Test Notes',
			created_at: new Date()
		};
		placeService.createPlace.mockResolvedValue(mockPlace);
		req.body = { name: 'test' };

		await controller.create(req, res, next);

		expect(res._getJSONData().success).toBe(true);
		expect(res.statusCode).toBe(201);
	});

	it('should handle create place error', async () => {
		placeService.createPlace.mockRejectedValue(new Error('fail'));
		await controller.create(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	it('should get all places', async () => {
		const mockPlace: PlaceDto = {
			place_id: '1',
			name: 'Test Place',
			latitude: 0,
			longitude: 0,
			address: 'Test Address',
			notes: 'Test Notes',
			created_at: new Date()
		};
		placeService.getAllPlaces.mockResolvedValue([mockPlace]);
		req.query = {};

		await controller.getAll(req, res, next);

		expect(res._getJSONData().success).toBe(true);
		expect(res.statusCode).toBe(200);
	});

	it('should handle get all places error', async () => {
		placeService.getAllPlaces.mockRejectedValue(new Error('fail'));
		await controller.getAll(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	it('should get place by id', async () => {
		const mockPlace: PlaceDto = {
			place_id: '1',
			name: 'Test Place',
			latitude: 0,
			longitude: 0,
			address: 'Test Address',
			notes: 'Test Notes',
			created_at: new Date()
		};
		placeService.getPlaceById.mockResolvedValue(mockPlace);
		req.params.place_id = '1';

		await controller.getById(req, res, next);

		expect(res._getJSONData().success).toBe(true);
		expect(res.statusCode).toBe(200);
	});

	it('should handle place not found by id', async () => {
		placeService.getPlaceById.mockResolvedValue(null);
		req.params.place_id = '1';

		await controller.getById(req, res, next);

		expect(res._getJSONData().success).toBe(false);
		expect(res.statusCode).toBe(404);
	});

	it('should handle get place by id error', async () => {
		placeService.getPlaceById.mockRejectedValue(new Error('fail'));
		req.params.place_id = '1';

		await controller.getById(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('should update place successfully', async () => {
		const mockPlace: PlaceDto = {
			place_id: '1',
			name: 'Updated Place',
			latitude: 0,
			longitude: 0,
			address: 'Updated Address',
			notes: 'Updated Notes',
			created_at: new Date()
		};
		placeService.updatePlace.mockResolvedValue(mockPlace);
		req.params.place_id = '1';
		req.body = { name: 'updated' };

		await controller.update(req, res, next);

		expect(res._getJSONData().success).toBe(true);
		expect(res.statusCode).toBe(200);
	});

	it('should handle update place not found', async () => {
		placeService.updatePlace.mockResolvedValue(null);
		req.params.place_id = '1';
		req.body = { name: 'updated' };

		await controller.update(req, res, next);

		expect(res._getJSONData().success).toBe(false);
		expect(res.statusCode).toBe(404);
	});

	it('should handle update place error', async () => {
		placeService.updatePlace.mockRejectedValue(new Error('fail'));
		req.params.place_id = '1';
		req.body = { name: 'updated' };


		await controller.update(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	it('should delete place successfully', async () => {
		placeService.deletePlace.mockResolvedValue(true);
		req.params.place_id = '1';

		await controller.delete(req, res, next);

		expect(res._getJSONData().success).toBe(true);
		expect(res.statusCode).toBe(200);
	});

	it('should handle delete place not found', async () => {
		placeService.deletePlace.mockResolvedValue(false);
		req.params.place_id = '1';

		await controller.delete(req, res, next);

		expect(res._getJSONData().success).toBe(false);
		expect(res.statusCode).toBe(404);
	});

	it('should handle delete place error', async () => {
		placeService.deletePlace.mockRejectedValue(new Error('fail'));
		req.params.place_id = '1';

		await controller.delete(req, res, next);
		
		expect(next).toHaveBeenCalled();
	});
});

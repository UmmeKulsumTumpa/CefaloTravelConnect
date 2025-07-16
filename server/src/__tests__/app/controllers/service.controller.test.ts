import { ServiceController } from '../../../app/controllers/service.controller';
import { ServiceService } from '../../../app/services/service.service';
import httpMocks from 'node-mocks-http';
import type { ServiceCreateRequestDto, ServiceUpdateRequestDto } from '../../../app/dtos/serviceDto';

describe('ServiceController', () => {
    let serviceService: jest.Mocked<ServiceService>;
    let controller: ServiceController;
    let req: any, res: any, next: jest.Mock;

    beforeEach(() => {
        serviceService = {
            createService: jest.fn(),
            getAll: jest.fn(),
            getServiceById: jest.fn(),
            updateService: jest.fn(),
            deleteService: jest.fn(),
            findNearbyServices: jest.fn(),
        } as any;
        controller = new ServiceController(serviceService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    const mockService = {
        service_id: '1',
        name: 'Test Service',
        type: 'Restaurant' as const,
        latitude: 23.7808,
        longitude: 90.2792,
        address: 'Test Address',
        description: 'Test Description',
        created_at: '2023-01-01T00:00:00.000Z',
        transport: null
    };

    describe('create', () => {
        it('should create service successfully', async () => {
            serviceService.createService.mockResolvedValue(mockService);
            req.body = {
                name: 'Test Service',
                type: 'Restaurant',
                latitude: 23.7808,
                longitude: 90.2792,
                address: 'Test Address',
                description: 'Test Description',
                transport: null
            };

            await controller.create(req, res, next);

            expect(serviceService.createService).toHaveBeenCalledWith({
                name: 'Test Service',
                type: 'Restaurant', 
                latitude: 23.7808,
                longitude: 90.2792,
                address: 'Test Address',
                description: 'Test Description',
                transport: null
            });
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Service created');
        });

        it('should handle service error', async () => {
            serviceService.createService.mockRejectedValue(new Error('Service error'));
            req.body = {
                name: 'Test Service',
                type: 'restaurant',
                latitude: 23.7808,
                longitude: 90.2792,
                address: 'Test Address',
                description: 'Test Description'
            };

            await controller.create(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getAll', () => {
        it('should get all services successfully', async () => {
            serviceService.getAll.mockResolvedValue([mockService]);
            req.query = { type: 'restaurant' };

            await controller.getAll(req, res, next);

            expect(serviceService.getAll).toHaveBeenCalledWith({ type: 'restaurant' });
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Services fetched successfully');
        });

        it('should handle empty query', async () => {
            serviceService.getAll.mockResolvedValue([mockService]);
            req.query = {};

            await controller.getAll(req, res, next);

            expect(serviceService.getAll).toHaveBeenCalledWith({});
            expect(res.statusCode).toBe(200);
        });

        it('should handle service error', async () => {
            serviceService.getAll.mockRejectedValue(new Error('Service error'));

            await controller.getAll(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getById', () => {
        it('should get service by id successfully', async () => {
            serviceService.getServiceById.mockResolvedValue(mockService);
            req.params.id = '1';

            await controller.getById(req, res, next);

            expect(serviceService.getServiceById).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Service fetched successfully');
        });

        it('should handle service error', async () => {
            serviceService.getServiceById.mockRejectedValue(new Error('Service error'));
            req.params.id = '1';

            await controller.getById(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('update', () => {
        it('should update service successfully', async () => {
            serviceService.updateService.mockResolvedValue(mockService);
            req.params.id = '1';
            req.body = {
                name: 'Updated Service',
                type: 'Hotel',
                latitude: 23.7808,
                longitude: 90.2792,
                address: 'Updated Address',
                description: 'Updated Description'
            };

            await controller.update(req, res, next);

            expect(serviceService.updateService).toHaveBeenCalledWith('1', {
                name: 'Updated Service',
                type: 'Hotel', 
                latitude: 23.7808,
                longitude: 90.2792,
                address: 'Updated Address',
                description: 'Updated Description',
                transport: undefined 
            });
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Service updated successfully');
        });

        it('should handle service error', async () => {
            serviceService.updateService.mockRejectedValue(new Error('Service error'));
            req.params.id = '1';
            req.body = { name: 'Updated Service' };

            await controller.update(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('delete', () => {
        it('should delete service successfully', async () => {
            serviceService.deleteService.mockResolvedValue(1);
            req.params.id = '1';

            await controller.delete(req, res, next);

            expect(serviceService.deleteService).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Service deleted successfully');
        });

        it('should handle service error', async () => {
            serviceService.deleteService.mockRejectedValue(new Error('Service error'));
            req.params.id = '1';

            await controller.delete(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('findNearbyServices', () => {
        it('should find nearby services successfully', async () => {
            serviceService.findNearbyServices.mockResolvedValue([mockService]);
            req.query = { latitude: '23.7808', longitude: '90.2792', radius: '5' };

            await controller.findNearbyServices(req, res, next);

            expect(serviceService.findNearbyServices).toHaveBeenCalledWith(23.7808, 90.2792, 5);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Nearby services fetched successfully');
        });

        it('should handle missing parameters', async () => {
            req.query = { latitude: '23.7808' };

            await controller.findNearbyServices(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('latitude, longitude, and radius are required');
        });

        it('should handle invalid latitude', async () => {
            req.query = { latitude: 'invalid', longitude: '90.2792', radius: '5' };

            await controller.findNearbyServices(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('latitude, longitude must be numbers and radius must be a positive number');
        });

        it('should handle invalid longitude', async () => {
            req.query = { latitude: '23.7808', longitude: 'invalid', radius: '5' };

            await controller.findNearbyServices(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('latitude, longitude must be numbers and radius must be a positive number');
        });

        it('should handle invalid radius', async () => {
            req.query = { latitude: '23.7808', longitude: '90.2792', radius: 'invalid' };

            await controller.findNearbyServices(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('latitude, longitude must be numbers and radius must be a positive number');
        });

        it('should handle negative radius', async () => {
            req.query = { latitude: '23.7808', longitude: '90.2792', radius: '-5' };

            await controller.findNearbyServices(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
            expect(res._getJSONData().message).toBe('latitude, longitude must be numbers and radius must be a positive number');
        });

        it('should handle service error', async () => {
            serviceService.findNearbyServices.mockRejectedValue(new Error('Service error'));
            req.query = { latitude: '23.7808', longitude: '90.2792', radius: '5' };

            await controller.findNearbyServices(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});

import { TransportController } from '../../../app/controllers/transport.controller';
import { TransportService } from '../../../app/services/transport.service';
import httpMocks from 'node-mocks-http';
import type { TransportCreateDto, TransportUpdateDto } from '../../../app/dtos/transportDto';

describe('TransportController', () => {
    let transportService: jest.Mocked<TransportService>;
    let controller: TransportController;
    let req: any, res: any;

    beforeEach(() => {
        transportService = {
            createTransport: jest.fn(),
            getTransportById: jest.fn(),
            searchTransports: jest.fn(),
            getAllTransports: jest.fn(),
            updateTransport: jest.fn(),
            deleteTransport: jest.fn(),
        } as any;
        controller = new TransportController(transportService);
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    const mockTransport = {
        service_id: '1',
        mode: 'bus',
        operator: 'Test Operator',
        created_at: '2023-01-01T00:00:00.000Z'
    };

    describe('createTransport', () => {
        it('should create transport successfully', async () => {
            transportService.createTransport.mockResolvedValue(mockTransport);
            req.body = {
                service_id: '1',
                mode: 'bus',
                operator: 'Test Operator'
            };

            await controller.createTransport(req, res);

            expect(transportService.createTransport).toHaveBeenCalledWith(req.body);
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Transport created successfully');
            expect(res._getJSONData().data).toEqual(mockTransport);
        });

        it('should handle service error', async () => {
            transportService.createTransport.mockRejectedValue(new Error('Service error'));
            req.body = {
                service_id: '1',
                mode: 'bus',
                operator: 'Test Operator'
            };

            await expect(controller.createTransport(req, res)).rejects.toThrow('Service error');
        });
    });

    describe('getTransports', () => {
        it('should get transport by service_id', async () => {
            transportService.getTransportById.mockResolvedValue(mockTransport);
            req.query = { service_id: '1' };

            await controller.getTransports(req, res);

            expect(transportService.getTransportById).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Transport fetched successfully');
            expect(res._getJSONData().data).toEqual(mockTransport);
        });

        it('should search transports by mode and operator', async () => {
            transportService.searchTransports.mockResolvedValue([mockTransport]);
            req.query = { mode: 'bus', operator: 'Test Operator' };

            await controller.getTransports(req, res);

            expect(transportService.searchTransports).toHaveBeenCalledWith({
                mode: 'bus',
                operator: 'Test Operator'
            });
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Transports fetched successfully');
            expect(res._getJSONData().data).toEqual([mockTransport]);
        });

        it('should search transports by mode only', async () => {
            transportService.searchTransports.mockResolvedValue([mockTransport]);
            req.query = { mode: 'bus' };

            await controller.getTransports(req, res);

            expect(transportService.searchTransports).toHaveBeenCalledWith({
                mode: 'bus',
                operator: undefined
            });
            expect(res.statusCode).toBe(200);
        });

        it('should search transports by operator only', async () => {
            transportService.searchTransports.mockResolvedValue([mockTransport]);
            req.query = { operator: 'Test Operator' };

            await controller.getTransports(req, res);

            expect(transportService.searchTransports).toHaveBeenCalledWith({
                mode: undefined,
                operator: 'Test Operator'
            });
            expect(res.statusCode).toBe(200);
        });

        it('should get all transports when no query params', async () => {
            transportService.getAllTransports.mockResolvedValue([mockTransport]);
            req.query = {};

            await controller.getTransports(req, res);

            expect(transportService.getAllTransports).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Transports fetched successfully');
            expect(res._getJSONData().data).toEqual([mockTransport]);
        });

        it('should handle service error', async () => {
            transportService.getAllTransports.mockRejectedValue(new Error('Service error'));
            req.query = {};

            await expect(controller.getTransports(req, res)).rejects.toThrow('Service error');
        });
    });

    describe('updateTransport', () => {
        it('should update transport successfully', async () => {
            const updatedTransport = { ...mockTransport, operator: 'Updated Operator' };
            transportService.updateTransport.mockResolvedValue(updatedTransport);
            req.params.service_id = '1';
            req.body = { operator: 'Updated Operator' };

            await controller.updateTransport(req, res);

            expect(transportService.updateTransport).toHaveBeenCalledWith('1', req.body);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Transport updated successfully');
            expect(res._getJSONData().data).toEqual(updatedTransport);
        });

        it('should handle service error', async () => {
            transportService.updateTransport.mockRejectedValue(new Error('Service error'));
            req.params.service_id = '1';
            req.body = { operator: 'Updated Operator' };

            await expect(controller.updateTransport(req, res)).rejects.toThrow('Service error');
        });
    });

    describe('deleteTransport', () => {
        it('should delete transport successfully', async () => {
            transportService.deleteTransport.mockResolvedValue(true);
            req.params.service_id = '1';

            await controller.deleteTransport(req, res);

            expect(transportService.deleteTransport).toHaveBeenCalledWith('1');
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().message).toBe('Transport deleted successfully');
            expect(res._getJSONData().data).toBeNull();
        });

        it('should handle service error', async () => {
            transportService.deleteTransport.mockRejectedValue(new Error('Service error'));
            req.params.service_id = '1';

            await expect(controller.deleteTransport(req, res)).rejects.toThrow('Service error');
        });
    });
});

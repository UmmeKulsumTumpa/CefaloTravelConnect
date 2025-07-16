import { ServiceService } from '../../../app/services/service.service';
import { AppError } from '../../../app/middlewares/error.middleware';
import { validateService, validateServiceUpdate } from '../../../app/validations/service.validation';
import { validateCreateTransport, validateUpdateTransport } from '../../../app/validations/transport.validation';

jest.mock('../../../app/validations/service.validation');
jest.mock('../../../app/validations/transport.validation');

function makeRepo() {
    return {
        create: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn(),
        findByIds: jest.fn(),
        findNearby: jest.fn(),
    };
}

function makeTransportSvc() {
    return {
        getTransportIfExists: jest.fn(),
        createTransport: jest.fn(),
        getTransportById: jest.fn(),
        updateTransport: jest.fn(),
        deleteTransport: jest.fn(),
        searchTransports: jest.fn(),
    };
}

describe('ServiceService', () => {
    let repo: ReturnType<typeof makeRepo>;
    let ts: ReturnType<typeof makeTransportSvc>;
    let svc: ServiceService;

    beforeEach(() => {
        repo = makeRepo();
        ts = makeTransportSvc();
        svc = new ServiceService(repo as any, ts as any);

        (validateService as jest.Mock).mockReturnValue({ valid: true, errors: [] });
        (validateServiceUpdate as jest.Mock).mockReturnValue({ valid: true, errors: [] });
        (validateCreateTransport as jest.Mock).mockReturnValue([]);
        (validateUpdateTransport as jest.Mock).mockReturnValue([]);
    });

    describe('buildServiceResponseWithTransport', () => {
        it('non-Transport returns DTO without transport', async () => {
            const s = { service_id: '1', type: 'Other', latitude: '1', longitude: '2', created_at: new Date() };

            const dto = await svc.buildServiceResponseWithTransport(s as any);

            expect(dto).not.toHaveProperty('transport');
        });

        it('Transport type includes transport data or null', async () => {
            const s = { service_id: '1', type: 'Transport', latitude: '0', longitude: '0', created_at: new Date() };
            ts.getTransportIfExists.mockResolvedValue(null);

            const dto = await svc.buildServiceResponseWithTransport(s as any);

            expect(ts.getTransportIfExists).toHaveBeenCalledWith('1');
            expect(dto.transport).toBeNull();
        });
    });

    describe('createService', () => {
        it('throws on invalid service', async () => {
            (validateService as jest.Mock).mockReturnValue({ valid: false, errors: ['err'] });
            await expect(svc.createService({} as any)).rejects.toThrow(AppError);
        });

        it('throws if DB created but not returned', async () => {
            repo.create.mockResolvedValue({ service_id: '1' });
            repo.findById.mockResolvedValue(null);

            await expect(svc.createService({ service_id: '1', type: 'Other' } as any)).rejects.toThrow(/Failed to create service/);
        });

        it('handles transport creation properly', async () => {
            const service = { service_id: '1', type: 'Transport', latitude: '0', longitude: '0', created_at: new Date() };
            repo.create.mockResolvedValue(service);
            repo.findById.mockResolvedValue(service);
            ts.getTransportById.mockResolvedValue({ service_id: '1', mode: 'a' } as any);

            const result = await svc.createService({
                service_id: '1',
                type: 'Transport',
                latitude: '0',
                longitude: '0',
                transport: { mode: 'a' } as any
            } as any);

            expect(ts.createTransport).toHaveBeenCalled();
            expect(result.transport).toEqual({ service_id: '1', mode: 'a' });
        });
    });

    describe('getServiceById', () => {
        it('throws AppError(404) when not found', async () => {
            repo.findById.mockResolvedValue(null);
            await expect(svc.getServiceById('notfound')).rejects.toThrow(AppError);
        });

        it('returns correct DTO including transport if applicable', async () => {
            const service = { service_id: '1', type: 'Transport', latitude: '0', longitude: '0', created_at: new Date() };
            repo.findById.mockResolvedValue(service);
            ts.getTransportIfExists.mockResolvedValue({ service_id: '1', mode: 'bus' });

            const result = await svc.getServiceById('1');

            expect(result).toBeDefined();
            expect(result!.transport).toEqual({ service_id: '1', mode: 'bus' });
        });
    });

    describe('updateService', () => {
        it('throws AppError(404) if service not found', async () => {
            repo.findById.mockResolvedValue(null);
            await expect(svc.updateService('notfound', {} as any)).rejects.toThrow(AppError);
        });

        it('throws AppError(400) on invalid update', async () => {
            repo.findById.mockResolvedValue({ service_id: '1', type: 'Other' });
            (validateServiceUpdate as jest.Mock).mockReturnValue({ valid: false, errors: ['bad'] });

            await expect(svc.updateService('1', {} as any)).rejects.toThrow(AppError);
        });

        it('throws AppError(500) if DB update fails', async () => {
            repo.findById.mockResolvedValue({ service_id: '1', type: 'Other' });

            (validateServiceUpdate as jest.Mock).mockReturnValue({ valid: true, errors: [] });
            repo.update.mockResolvedValue(undefined);

            await expect(svc.updateService('1', { name: 'x' } as any)).rejects.toThrow(/Failed to update/);
        });

        it('handles transport update scenario correctly', async () => {
            repo.findById.mockResolvedValue({ service_id: '1', type: 'Transport' });

            (validateServiceUpdate as jest.Mock).mockReturnValue({ valid: true, errors: [] });
            repo.update.mockResolvedValue({ service_id: '1', type: 'Transport' });
            (validateUpdateTransport as jest.Mock).mockReturnValue([]);

            ts.updateTransport.mockResolvedValue({});
            ts.getTransportIfExists.mockResolvedValue({ service_id: '1', mode: 'bus' });

            const result = await svc.updateService('1', { name: 'x', transport: { mode: 'bus' } } as any);

            expect(result).toBeDefined();
            expect(result!.transport).toEqual({ service_id: '1', mode: 'bus' });
        });

        it('returns DTO via buildServiceResponseWithTransport if no transport or not Transport type', async () => {
            repo.findById.mockResolvedValue({ service_id: '1', type: 'Other' });
            (validateServiceUpdate as jest.Mock).mockReturnValue({ valid: true, errors: [] });
            repo.update.mockResolvedValue({ service_id: '1', type: 'Other' });

            const result = await svc.updateService('1', { name: 'x' } as any);

            expect(result).toHaveProperty('service_id', '1');
        });
    });

    describe('deleteService', () => {
        it('throws AppError(404) if not found', async () => {
            repo.findById.mockResolvedValue(null);
            await expect(svc.deleteService('notfound')).rejects.toThrow(AppError);
        });

        it('calls transportService.deleteTransport if type=="Transport"', async () => {
            repo.findById.mockResolvedValue({ service_id: '1', type: 'Transport' });
            repo.delete.mockResolvedValue(1);
            ts.deleteTransport.mockResolvedValue(1);

            const result = await svc.deleteService('1');

            expect(ts.deleteTransport).toHaveBeenCalledWith('1');
            expect(result).toBe(1);
        });

        it('throws AppError(500) if delete returns falsy', async () => {
            repo.findById.mockResolvedValue({ service_id: '1', type: 'Other' });
            repo.delete.mockResolvedValue(0);

            await expect(svc.deleteService('1')).rejects.toThrow(/Failed to delete/);
        });

        it('returns deletion count on success', async () => {
            repo.findById.mockResolvedValue({ service_id: '1', type: 'Other' });
            repo.delete.mockResolvedValue(1);

            const result = await svc.deleteService('1');

            expect(result).toBe(1);
        });
    });

    describe('getAll', () => {
        it('returns [] if searchTransports returns empty', async () => {
            ts.searchTransports.mockResolvedValue([]);

            const result = await svc.getAll({ mode: 'bus' });

            expect(result).toEqual([]);
        });

        it('returns filtered services if searchTransports returns results', async () => {
            ts.searchTransports.mockResolvedValue([{ service_id: '1' }]);
            repo.findByIds.mockResolvedValue([{ service_id: '1', type: 'Other', created_at: new Date() }]);
            svc.buildServiceResponseWithTransport = jest.fn().mockResolvedValue({ service_id: '1', type: 'Other' });

            const result = await svc.getAll({ mode: 'bus' });

            expect(repo.findByIds).toHaveBeenCalledWith(['1']);
            expect(result[0]).toHaveProperty('service_id', '1');
        });

        it('calls serviceRepository.findAll and returns built DTOs if no mode/operator', async () => {
            repo.findAll.mockResolvedValue([{ service_id: '1', type: 'Other', created_at: new Date() }]);
            svc.buildServiceResponseWithTransport = jest.fn().mockResolvedValue({ service_id: '1', type: 'Other' });

            const result = await svc.getAll();

            expect(repo.findAll).toHaveBeenCalled();
            expect(result[0]).toHaveProperty('service_id', '1');
        });
    });

    describe('findNearbyServices', () => {
        it('calls repository.findNearby with correct radius and returns built DTOs', async () => {
            repo.findNearby.mockResolvedValue([{ service_id: '1', type: 'Other', created_at: new Date() }]);
            svc.buildServiceResponseWithTransport = jest.fn().mockResolvedValue({ service_id: '1', type: 'Other' });

            const result = await svc.findNearbyServices(10, 20, 5);
            
            expect(repo.findNearby).toHaveBeenCalledWith(10, 20, 5000);
            expect(result[0]).toHaveProperty('service_id', '1');
        });
    });
});

import { TransportService } from '../../../app/services/transport.service';
import { AppError } from '../../../app/middlewares/error.middleware';
import { validateCreateTransport, validateUpdateTransport } from '../../../app/validations/transport.validation';

jest.mock('../../../app/validations/transport.validation');

function makeRepo() {
    return {
        createTransport: jest.fn(),
        getTransportById: jest.fn(),
        getAllTransports: jest.fn(),
        updateTransport: jest.fn(),
        deleteTransport: jest.fn(),
        searchTransports: jest.fn(),
    };
}

describe('TransportService', () => {
    let repo: ReturnType<typeof makeRepo>;
    let svc: TransportService;

    beforeEach(() => {
        repo = makeRepo();
        svc = new TransportService(repo);
        (validateCreateTransport as jest.Mock).mockReturnValue([]);
        (validateUpdateTransport as jest.Mock).mockReturnValue([]);
    });

    describe('createTransport', () => {
        it('throws if missing service_id', async () => {
            await expect(svc.createTransport({ service_id: '', mode: 'a' }))
                .rejects.toThrow(AppError);
        });

        it('throws conflict if already exists', async () => {
            jest.spyOn(svc, 'getTransportIfExists').mockResolvedValue({ service_id: 's1' } as any);
            await expect(svc.createTransport({ service_id: 's1', mode: 'a' }))
                .rejects.toThrow(/already exists/);
        });

        it('throws if validation errors', async () => {
            (validateCreateTransport as jest.Mock).mockReturnValue(['err']);
            jest.spyOn(svc, 'getTransportIfExists').mockResolvedValue(null);
            await expect(svc.createTransport({ service_id: 's2', mode: 'a' }))
                .rejects.toThrow(/err/);
        });

        it('returns transport on success', async () => {
            jest.spyOn(svc, 'getTransportIfExists').mockResolvedValue(null);
            const t = { service_id: 's2', mode: 'a' };
            repo.createTransport.mockResolvedValue(t);
            await expect(svc.createTransport({ service_id: 's2', mode: 'a' })).resolves.toBe(t);
        });
    });

    describe('getTransportById', () => {
        it('throws 404 if not found', async () => {
            repo.getTransportById.mockResolvedValue(null);
            await expect(svc.getTransportById('s1')).rejects.toThrow(AppError);
        });
        it('returns transport when found', async () => {
            const t = { service_id: 's1' };
            repo.getTransportById.mockResolvedValue(t);
            await expect(svc.getTransportById('s1')).resolves.toBe(t);
        });
    });

    describe('getTransportIfExists', () => {
        it('returns null when not found', async () => {
            jest.spyOn(svc, 'getTransportById').mockRejectedValue(new AppError('Transport not found', 404));
            await expect(svc.getTransportIfExists('s0')).resolves.toBeNull();
        });
        it('throws on other errors', async () => {
            jest.spyOn(svc, 'getTransportById').mockRejectedValue(new AppError('Other', 400));
            await expect(svc.getTransportIfExists('s0')).rejects.toThrow(AppError);
        });
        it('returns transport when exists', async () => {
            const t = { service_id: 's1' };
            jest.spyOn(svc, 'getTransportById').mockResolvedValue(t as any);
            await expect(svc.getTransportIfExists('s1')).resolves.toBe(t);
        });
    });

    describe('getAllTransports', () => {
        it('returns all transports', async () => {
            const arr = [{ id: 1 }];
            repo.getAllTransports.mockResolvedValue(arr);
            await expect(svc.getAllTransports()).resolves.toBe(arr);
        });
    });

    describe('updateTransport', () => {
        it('throws 404 if not existing', async () => {
            jest.spyOn(svc, 'getTransportIfExists').mockResolvedValue(null);
            await expect(svc.updateTransport('s1', {} as any)).rejects.toThrow(AppError);
        });
        it('throws 400 if validation errors', async () => {
            jest.spyOn(svc, 'getTransportIfExists').mockResolvedValue({} as any);
            (validateUpdateTransport as jest.Mock).mockReturnValue(['v']);
            await expect(svc.updateTransport('s1', {} as any)).rejects.toThrow(/v/);
        });
        it('throws 404 if update returns null', async () => {
            jest.spyOn(svc, 'getTransportIfExists').mockResolvedValue({} as any);
            (validateUpdateTransport as jest.Mock).mockReturnValue([]);
            repo.updateTransport.mockResolvedValue(null);
            await expect(svc.updateTransport('s1', {} as any)).rejects.toThrow(AppError);
        });
        it('returns when successful', async () => {
            jest.spyOn(svc, 'getTransportIfExists').mockResolvedValue({} as any);
            (validateUpdateTransport as jest.Mock).mockReturnValue([]);
            const t = { service_id: 's1' };
            repo.updateTransport.mockResolvedValue(t);
            await expect(svc.updateTransport('s1', {} as any)).resolves.toBe(t);
        });
    });

    describe('deleteTransport', () => {
        it('throws 404 if not existing', async () => {
            jest.spyOn(svc, 'getTransportIfExists').mockResolvedValue(null);
            await expect(svc.deleteTransport('s1')).rejects.toThrow(AppError);
        });
        it('returns boolean when exists', async () => {
            jest.spyOn(svc, 'getTransportIfExists').mockResolvedValue({} as any);
            repo.deleteTransport.mockResolvedValue(true);
            await expect(svc.deleteTransport('s1')).resolves.toBe(true);
        });
    });

    describe('searchTransports', () => {
        it('throws 404 if no results', async () => {
            repo.searchTransports.mockResolvedValue([]);
            await expect(svc.searchTransports({})).rejects.toThrow(AppError);
        });
        it('returns results when found', async () => {
            const arr = [{ id: 1 }];
            repo.searchTransports.mockResolvedValue(arr);
            await expect(svc.searchTransports({})).resolves.toBe(arr);
        });
    });
});

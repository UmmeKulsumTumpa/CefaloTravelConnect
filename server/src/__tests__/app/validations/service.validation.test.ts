import { validateService, validateServiceUpdate } from '../../../app/validations/service.validation';

jest.mock('../../../app/validations/transport.validation', () => ({
  validateCreateTransport: jest.fn(() => []),
  validateUpdateTransport: jest.fn(() => [])
}));
const { validateCreateTransport } = require('../../../app/validations/transport.validation');

describe('validateService', () => {
  it('returns valid for correct input', () => {
    const data = { name: 'Hotel', type: 'Hotel', latitude: 10, longitude: 20 };
    const result = validateService(data as any);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
  it('fails for missing/invalid name', () => {
    expect(validateService({ type: 'Hotel' } as any).valid).toBe(false);
    expect(validateService({ name: 123, type: 'Hotel' } as any).valid).toBe(false);
    expect(validateService({ name: 'a'.repeat(256), type: 'Hotel' } as any).valid).toBe(false);
  });
  it('fails for missing/invalid type', () => {
    expect(validateService({ name: 'x' } as any).valid).toBe(false);
    expect(validateService({ name: 'x', type: 'Invalid' } as any).valid).toBe(false);
  });
  it('fails for invalid latitude', () => {
    expect(validateService({ name: 'x', type: 'Hotel', latitude: -91 } as any).valid).toBe(false);
    expect(validateService({ name: 'x', type: 'Hotel', latitude: 91 } as any).valid).toBe(false);
    expect(validateService({ name: 'x', type: 'Hotel', latitude: 'bad' } as any).valid).toBe(false);
  });
  it('fails for invalid longitude', () => {
    expect(validateService({ name: 'x', type: 'Hotel', longitude: -181 } as any).valid).toBe(false);
    expect(validateService({ name: 'x', type: 'Hotel', longitude: 181 } as any).valid).toBe(false);
    expect(validateService({ name: 'x', type: 'Hotel', longitude: 'bad' } as any).valid).toBe(false);
  });
  it('fails for invalid address', () => {
    expect(validateService({ name: 'x', type: 'Hotel', address: 123 } as any).valid).toBe(false);
  });
  it('fails for invalid description', () => {
    expect(validateService({ name: 'x', type: 'Hotel', description: 123 } as any).valid).toBe(false);
  });
  it('fails for invalid transport (calls validateCreateTransport)', () => {
    (validateCreateTransport as jest.Mock).mockReturnValue(['bad transport']);
    const data = { name: 'x', type: 'Transport', transport: { mode: 123 } };
    const result = validateService(data as any);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('bad transport');
  });
});

describe('validateServiceUpdate', () => {
  it('returns valid for correct input', () => {
    const data = { name: 'Hotel', type: 'Hotel', latitude: 10, longitude: 20 };
    const result = validateServiceUpdate(data as any);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
  it('fails for invalid name', () => {
    expect(validateServiceUpdate({ name: 123 } as any).valid).toBe(false);
    expect(validateServiceUpdate({ name: 'a'.repeat(256) } as any).valid).toBe(false);
  });
  it('fails for invalid type', () => {
    expect(validateServiceUpdate({ type: 'Invalid' } as any).valid).toBe(false);
  });
  it('fails for invalid latitude', () => {
    expect(validateServiceUpdate({ latitude: -91 } as any).valid).toBe(false);
    expect(validateServiceUpdate({ latitude: 91 } as any).valid).toBe(false);
    expect(validateServiceUpdate({ latitude: 'bad' } as any).valid).toBe(false);
  });
  it('fails for invalid longitude', () => {
    expect(validateServiceUpdate({ longitude: -181 } as any).valid).toBe(false);
    expect(validateServiceUpdate({ longitude: 181 } as any).valid).toBe(false);
    expect(validateServiceUpdate({ longitude: 'bad' } as any).valid).toBe(false);
  });
  it('fails for invalid address', () => {
    expect(validateServiceUpdate({ address: 123 } as any).valid).toBe(false);
  });
  it('fails for invalid description', () => {
    expect(validateServiceUpdate({ description: 123 } as any).valid).toBe(false);
  });
});

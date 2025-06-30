import { validateCreateTransport, validateUpdateTransport } from '../../../app/validations/transport.validation';

describe('validateCreateTransport', () => {
  it('returns [] for valid input', () => {
    expect(validateCreateTransport({ mode: 'bus' } as any)).toEqual([]);
  });
  it('fails for missing/invalid mode', () => {
    expect(validateCreateTransport({} as any)).toContain('mode (string) is required');
    expect(validateCreateTransport({ mode: 123 } as any)).toContain('mode (string) is required');
  });
  it('fails for invalid operator', () => {
    expect(validateCreateTransport({ mode: 'bus', operator: 123 } as any)).toContain('operator must be a string');
  });
});

describe('validateUpdateTransport', () => {
  it('returns [] for valid input', () => {
    expect(validateUpdateTransport({ mode: 'bus' } as any)).toEqual([]);
  });
  it('fails for invalid mode', () => {
    expect(validateUpdateTransport({ mode: 123 } as any)).toContain('mode must be a string');
  });
  it('fails for invalid operator', () => {
    expect(validateUpdateTransport({ operator: 123 } as any)).toContain('operator must be a string');
  });
});

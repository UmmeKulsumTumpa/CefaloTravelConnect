import { validatePlaceCreate, validatePlaceUpdate, validatePlaceQuery } from '../../../app/validations/place.validation';

describe('validatePlaceCreate', () => {
  it('returns valid for correct input', () => {
    const data = { name: 'Place', latitude: 1, longitude: 2 };
    expect(validatePlaceCreate(data).valid).toBe(true);
    expect(validatePlaceCreate(data).errors).toEqual([]);
  });
  it('fails for missing/invalid name', () => {
    expect(validatePlaceCreate({ latitude: 1, longitude: 2 }).valid).toBe(false);
    expect(validatePlaceCreate({ name: '', latitude: 1, longitude: 2 }).valid).toBe(false);
    expect(validatePlaceCreate({ name: 123, latitude: 1, longitude: 2 }).valid).toBe(false);
  });
  it('fails for missing/invalid latitude', () => {
    expect(validatePlaceCreate({ name: 'x', longitude: 2 }).valid).toBe(false);
    expect(validatePlaceCreate({ name: 'x', latitude: 'bad', longitude: 2 }).valid).toBe(false);
  });
  it('fails for missing/invalid longitude', () => {
    expect(validatePlaceCreate({ name: 'x', latitude: 1 }).valid).toBe(false);
    expect(validatePlaceCreate({ name: 'x', latitude: 1, longitude: 'bad' }).valid).toBe(false);
  });
  it('fails for invalid address', () => {
    expect(validatePlaceCreate({ name: 'x', latitude: 1, longitude: 2, address: 123 }).valid).toBe(false);
  });
  it('fails for invalid notes', () => {
    expect(validatePlaceCreate({ name: 'x', latitude: 1, longitude: 2, notes: 123 }).valid).toBe(false);
  });
});

describe('validatePlaceUpdate', () => {
  it('returns valid for correct input', () => {
    expect(validatePlaceUpdate({}).valid).toBe(true);
  });
  it('fails for invalid name', () => {
    expect(validatePlaceUpdate({ name: '' }).valid).toBe(false);
    expect(validatePlaceUpdate({ name: 123 }).valid).toBe(false);
  });
  it('fails for invalid latitude', () => {
    expect(validatePlaceUpdate({ latitude: 'bad' }).valid).toBe(false);
  });
  it('fails for invalid longitude', () => {
    expect(validatePlaceUpdate({ longitude: 'bad' }).valid).toBe(false);
  });
  it('fails for invalid address', () => {
    expect(validatePlaceUpdate({ address: 123 }).valid).toBe(false);
  });
  it('fails for invalid notes', () => {
    expect(validatePlaceUpdate({ notes: 123 }).valid).toBe(false);
  });
});

describe('validatePlaceQuery', () => {
  it('returns valid for correct input', () => {
    expect(validatePlaceQuery({}).valid).toBe(true);
  });
  it('fails for invalid place_id', () => {
    expect(validatePlaceQuery({ place_id: 123 }).valid).toBe(false);
  });
  it('fails for invalid name', () => {
    expect(validatePlaceQuery({ name: 123 }).valid).toBe(false);
  });
  it('fails for invalid address', () => {
    expect(validatePlaceQuery({ address: 123 }).valid).toBe(false);
  });
});

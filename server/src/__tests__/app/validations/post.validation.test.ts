import { validateCreatePost, validateUpdatePost } from '../../../app/validations/Post.validation';

describe('validateCreatePost', () => {
  it('returns [] for valid input', () => {
    expect(validateCreatePost({ title: 't' })).toEqual([]);
  });
  it('fails for missing/invalid title', () => {
    expect(validateCreatePost({})).toEqual(
      expect.arrayContaining([expect.stringContaining('title is required')])
    );
    expect(validateCreatePost({ title: 123 })).toEqual(
      expect.arrayContaining([expect.stringContaining('title is required')])
    );
  });
  it('fails for invalid description', () => {
    expect(validateCreatePost({ title: 't', description: 123 })).toContain('description must be a string');
  });
  it('fails for invalid total_cost', () => {
    expect(validateCreatePost({ title: 't', total_cost: 'bad' })).toContain('total_cost must be a number');
  });
  it('fails for invalid total_duration', () => {
    expect(validateCreatePost({ title: 't', total_duration: 'bad' })).toContain('total_duration must be a number');
  });
  it('fails for invalid effort_level', () => {
    expect(validateCreatePost({ title: 't', effort_level: 'bad' })).toEqual(
      expect.arrayContaining([expect.stringContaining('effort_level must be one of')])
    );
  });
  it('fails for invalid categories', () => {
    expect(validateCreatePost({ title: 't', categories: 'bad' })).toContain('categories must be an array');
  });
  it('fails for invalid visibility', () => {
    expect(validateCreatePost({ title: 't', visibility: 'bad' })).toEqual(
      expect.arrayContaining([expect.stringContaining('visibility must be one of')])
    );
  });
});

describe('validateUpdatePost', () => {
  it('returns [] for valid input', () => {
    expect(validateUpdatePost({ title: 't' })).toEqual([]);
  });
  it('fails for invalid title', () => {
    expect(validateUpdatePost({ title: 123 })).toContain('title must be a string');
  });
  it('fails for invalid description', () => {
    expect(validateUpdatePost({ description: 123 })).toContain('description must be a string');
  });
  it('fails for invalid total_cost', () => {
    expect(validateUpdatePost({ total_cost: 'bad' })).toContain('total_cost must be a number');
  });
  it('fails for invalid total_duration', () => {
    expect(validateUpdatePost({ total_duration: 'bad' })).toContain('total_duration must be a number');
  });
  it('fails for invalid effort_level', () => {
    expect(validateUpdatePost({ effort_level: 'bad' })).toEqual(
      expect.arrayContaining([expect.stringContaining('effort_level must be one of')])
    );
  });
  it('fails for invalid categories', () => {
    expect(validateUpdatePost({ categories: 'bad' })).toContain('categories must be an array');
  });
  it('fails for invalid visibility', () => {
    expect(validateUpdatePost({ visibility: 'bad' })).toEqual(
      expect.arrayContaining([expect.stringContaining('visibility must be one of')])
    );
  });
});

import { signupSchema, signinSchema, updateUserSchema, changePasswordSchema } from '../../../app/validations/User.validation';

describe('signupSchema', () => {
  it('passes for valid input', () => {
    expect(() => signupSchema.parse({ email: 'a@b.com', password: '123456' })).not.toThrow();
  });
  it('fails for invalid email', () => {
    expect(() => signupSchema.parse({ email: 'bad', password: '123456' })).toThrow();
  });
  it('fails for invalid password', () => {
    expect(() => signupSchema.parse({ email: 'a@b.com', password: '123' })).toThrow();
  });
});

describe('signinSchema', () => {
  it('passes for valid input', () => {
    expect(() => signinSchema.parse({ email: 'a@b.com', password: '123456' })).not.toThrow();
  });
  it('fails for invalid email', () => {
    expect(() => signinSchema.parse({ email: 'bad', password: '123456' })).toThrow();
  });
  it('fails for invalid password', () => {
    expect(() => signinSchema.parse({ email: 'a@b.com', password: '123' })).toThrow();
  });
});

describe('updateUserSchema', () => {
  it('passes for valid input', () => {
    expect(() => updateUserSchema.parse({ username: 'u', age: 20 })).not.toThrow();
  });
  it('fails for invalid email', () => {
    expect(() => updateUserSchema.parse({ email: 'bad' })).toThrow();
  });
  it('fails for invalid age', () => {
    expect(() => updateUserSchema.parse({ age: 'bad' })).toThrow();
  });
});

describe('changePasswordSchema', () => {
  it('passes for valid input', () => {
    expect(() => changePasswordSchema.parse({ oldPassword: '123456', newPassword: '654321' })).not.toThrow();
  });
  it('fails for invalid oldPassword', () => {
    expect(() => changePasswordSchema.parse({ oldPassword: '123', newPassword: '654321' })).toThrow();
  });
  it('fails for invalid newPassword', () => {
    expect(() => changePasswordSchema.parse({ oldPassword: '123456', newPassword: '123' })).toThrow();
  });
});

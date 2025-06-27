export function mockUserRepository() {
    return {
        create: jest.fn(),
        findById: jest.fn(),
        findUsers: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        saveRefreshToken: jest.fn(),
        deleteRefreshToken: jest.fn(),
        findRefreshToken: jest.fn(),
        deleteAllRefreshTokensForUser: jest.fn(),
    };
}

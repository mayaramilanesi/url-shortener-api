// E2E test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-e2e';
  process.env.JWT_EXPIRES_IN = '1h';
  // SQLite em memória não precisa de DATABASE_URL
});

afterAll(async () => {
  // Cleanup after all tests
  jest.clearAllMocks();
});

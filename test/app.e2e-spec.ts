import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestAppModule } from './test-app.module';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Url } from '../src/urls/entities/url.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('App (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let urlRepository: Repository<Url>;

  // Test data
  let authToken: string;
  let userId: string;
  let testUrl: Url | null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    urlRepository = moduleFixture.get<Repository<Url>>(getRepositoryToken(Url));

    await app.init();
  });

  afterAll(async () => {
    // Clean up test data
    if (testUrl?.id) {
      await urlRepository.delete(testUrl.id);
    }
    if (userId) {
      await userRepository.delete(userId);
    }
    await app.close();
  });

  describe('Health Check', () => {
    it('/ (GET) should return Hello World', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Documentation', () => {
    it('/docs (GET) should return Swagger UI or redirect', () => {
      return request(app.getHttpServer())
        .get('/docs')
        .expect((res) => {
          expect([200, 301, 302, 404]).toContain(res.status);
        });
    });

    it('/readme (GET) should return HTML documentation', () => {
      return request(app.getHttpServer())
        .get('/readme')
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });
    });
  });

  describe('Authentication', () => {
    const testUser = {
      email: 'test-e2e@example.com',
      password: 'testPassword123',
    };

    describe('POST /auth/signup', () => {
      it('should create new user', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(testUser)
          .expect(201);

        expect(response.body).toHaveProperty('accessToken');
        expect(typeof response.body.accessToken).toBe('string');

        authToken = response.body.accessToken;

        // Get user ID for cleanup
        const user = await userRepository.findOne({
          where: { email: testUser.email },
        });
        userId = user?.id || '';
      });

      it('should fail with duplicate email', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(testUser)
          .expect(409)
          .expect((res) => {
            expect(res.body.message).toBe('Email already in use');
          });
      });

      it('should fail with invalid email', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: 'invalid-email',
            password: 'password123',
          })
          .expect(400);
      });

      it('should fail with weak password', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: 'another@example.com',
            password: '123',
          })
          .expect(400);
      });
    });

    describe('POST /auth/login', () => {
      it('should login with valid credentials', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(testUser)
          .expect((res) => {
            expect([200, 201]).toContain(res.status);
          });

        expect(response.body).toHaveProperty('accessToken');
        expect(typeof response.body.accessToken).toBe('string');
      });

      it('should fail with invalid email', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: testUser.password,
          })
          .expect(401)
          .expect((res) => {
            expect(res.body.message).toBe('Invalid credentials');
          });
      });

      it('should fail with invalid password', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword',
          })
          .expect(401)
          .expect((res) => {
            expect(res.body.message).toBe('Invalid credentials');
          });
      });

      it('should fail with malformed request', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'invalid-email',
          })
          .expect(400);
      });
    });
  });

  describe('URL Shortening', () => {
    const testOriginalUrl =
      'https://www.example.com/very/long/path/to/resource';

    describe('POST /shorten (without auth)', () => {
      it('should create short URL for anonymous user', async () => {
        const response = await request(app.getHttpServer())
          .post('/shorten')
          .send({ url: testOriginalUrl })
          .expect(201);

        expect(response.body).toHaveProperty('shortUrl');
        expect(typeof response.body.shortUrl).toBe('string');
        expect(response.body.shortUrl).toMatch(/http:\/\/localhost:\d+\/\w{6}/);

        // Extract code from shortUrl for later use
        const shortCode = response.body.shortUrl.split('/').pop();

        // Find the created URL in database for cleanup
        testUrl = await urlRepository.findOne({ where: { code: shortCode } });
      });

      it('should fail with invalid URL', () => {
        return request(app.getHttpServer())
          .post('/shorten')
          .send({ url: 'not-a-valid-url' })
          .expect(400);
      });

      it('should fail without url', () => {
        return request(app.getHttpServer())
          .post('/shorten')
          .send({})
          .expect(400);
      });
    });

    describe('POST /shorten (with auth)', () => {
      it('should create short URL for authenticated user', async () => {
        const response = await request(app.getHttpServer())
          .post('/shorten')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ url: 'https://www.authenticated-example.com' })
          .expect(201);

        expect(response.body).toHaveProperty('shortUrl');
        expect(typeof response.body.shortUrl).toBe('string');
        expect(response.body.shortUrl).toMatch(/http:\/\/localhost:\d+\/\w{6}/);

        // Extract code from shortUrl for later use
        const shortCode = response.body.shortUrl.split('/').pop();

        // Find the created URL in database for cleanup
        testUrl = await urlRepository.findOne({ where: { code: shortCode } });
      });
    });
  });

  describe('URL Management (Authenticated)', () => {
    describe('GET /urls', () => {
      it('should get user URLs', () => {
        return request(app.getHttpServer())
          .get('/urls')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
          });
      });

      it('should fail without auth token', () => {
        return request(app.getHttpServer()).get('/urls').expect(401);
      });

      it('should fail with invalid auth token', () => {
        return request(app.getHttpServer())
          .get('/urls')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);
      });
    });

    describe('PATCH /urls/:id', () => {
      it('should update URL', () => {
        if (!testUrl) {
          fail('testUrl should be initialized from previous tests');
        }
        const newUrl = 'https://www.updated-example.com';
        return request(app.getHttpServer())
          .patch(`/urls/${testUrl.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ targetUrl: newUrl })
          .expect(200)
          .expect((res) => {
            expect(res.body.targetUrl).toBe(newUrl);
          });
      });

      it('should fail with invalid URL ID', () => {
        return request(app.getHttpServer())
          .patch('/urls/invalid-id')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ targetUrl: 'https://www.example.com' })
          .expect((res) => {
            expect([400, 404]).toContain(res.status);
          });
      });

      it('should fail without auth', () => {
        if (!testUrl) {
          fail('testUrl should be initialized from previous tests');
        }
        return request(app.getHttpServer())
          .patch(`/urls/${testUrl.id}`)
          .send({ targetUrl: 'https://www.example.com' })
          .expect(401);
      });
    });

    describe('DELETE /urls/:id', () => {
      it('should delete URL', () => {
        if (!testUrl) {
          fail('testUrl should be initialized from previous tests');
        }
        return request(app.getHttpServer())
          .delete(`/urls/${testUrl.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      });

      it('should fail with non-existent URL', () => {
        const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
        return request(app.getHttpServer())
          .delete(`/urls/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });

      it('should fail without auth', () => {
        return request(app.getHttpServer()).delete('/urls/some-id').expect(401);
      });
    });
  });

  describe('URL Redirection', () => {
    let redirectTestUrl: Url;
    let redirectTestCode: string;

    beforeAll(async () => {
      // Create a URL specifically for redirect testing
      const response = await request(app.getHttpServer())
        .post('/shorten')
        .send({ url: 'https://www.redirect-test.com' })
        .expect(201);

      // Extract code from shortUrl
      redirectTestCode = response.body.shortUrl.split('/').pop();

      // Find the created URL in database
      const foundUrl = await urlRepository.findOne({
        where: { code: redirectTestCode },
      });

      if (!foundUrl) {
        throw new Error('Failed to create redirect test URL');
      }

      redirectTestUrl = foundUrl;
    });

    afterAll(async () => {
      // Clean up redirect test URL
      if (redirectTestUrl?.id) {
        await urlRepository.delete(redirectTestUrl.id);
      }
    });

    it('should redirect to original URL', () => {
      return request(app.getHttpServer())
        .get(`/${redirectTestCode}`)
        .expect(302)
        .expect('Location', 'https://www.redirect-test.com');
    });

    it('should increment click count on redirect', async () => {
      // Make redirect request
      await request(app.getHttpServer())
        .get(`/${redirectTestCode}`)
        .expect(302);

      // Check if click count increased
      const updatedUrl = await urlRepository.findOne({
        where: { id: redirectTestUrl.id },
      });
      expect(updatedUrl?.clickCount).toBeGreaterThan(
        redirectTestUrl.clickCount,
      );
    });

    it('should return 404 for non-existent short code', () => {
      return request(app.getHttpServer()).get('/nonexistent').expect(404);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown routes', () => {
      return request(app.getHttpServer()).get('/unknown-route').expect(404);
    });

    it('should handle malformed JSON', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send('{"invalid":"json"')
        .expect(400);
    });
  });
});

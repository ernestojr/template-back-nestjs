import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Obtener token de autenticación antes de las pruebas
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@example.com',
        password: 'admin123',
      });

    authToken = loginResponse.body.access_token;
  });

  describe('Auth', () => {
    it('/auth/signup (POST)', () => {
      const signUpDto = {
        fullname: 'New Test User',
        email: 'newtest@example.com',
        rut: '98765432-1',
        password: 'password123',
        role: 'user',
        active: true,
      };

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.fullname).toBe(signUpDto.fullname);
          expect(res.body.email).toBe(signUpDto.email);
          expect(res.body.password).not.toBe(signUpDto.password);
        });
    });

    it('/auth/signin (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'admin@example.com',
          password: 'admin123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('email', 'admin@example.com');
        });
    });
  });

  describe('UsersController (e2e)', () => {
    const testUser: CreateUserDto = {
      fullname: 'Test User',
      email: 'test@example.com',
      rut: '12345678-9',
      password: 'password123',
      role: 'user',
      active: true,
    };

    let userId: number;

    it('/users (POST)', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.fullname).toBe(testUser.fullname);
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.password).not.toBe(testUser.password);
          expect(res.body.password).toMatch(/^\$2[aby]\$\d+\$/);
          userId = res.body.id;
        });
    });

    it('/users (GET)', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/users/:id (GET)', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body.fullname).toBe(testUser.fullname);
          expect(res.body.email).toBe(testUser.email);
        });
    });

    it('/users/:id (PUT)', () => {
      const updateData = {
        fullname: 'Updated Test User',
        active: false,
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0]).toBeGreaterThan(0);
          expect(res.body[1][0].fullname).toBe(updateData.fullname);
          expect(res.body[1][0].active).toBe(updateData.active);
        });
    });

    it('/users/:id (DELETE)', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('/users/:id (GET) - Should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    // Test de autorización
    it('should return 401 when no token is provided', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });

    it('should return 401 when invalid token is provided', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

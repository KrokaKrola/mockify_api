import * as request from 'supertest';

import type { INestApplication } from '@nestjs/common';

import { E2EUtilsService } from '../utils/e2e-utils.service';

describe('Auth (e2e)', () => {
    const e2eUtilsService: E2EUtilsService = new E2EUtilsService();

    let app: INestApplication;

    beforeAll(async () => {
        app = await e2eUtilsService.initApp();
        await app.init();
    });

    describe('authorization', () => {
        it('should register user and allow to auth with this credentials', async () => {
            const signUpResponse = await request(app.getHttpServer()).post('/auth/sign-up').send({
                email: 'test+1@mail.ru',
                password: '12345678',
                passwordConfirmation: '12345678',
            });

            expect(signUpResponse.status).toBe(201);
            expect(signUpResponse.body.email).toBe('test+1@mail.ru');

            const signInResponse = await request(app.getHttpServer()).post('/auth/sign-in').send({
                email: 'test+1@mail.ru',
                password: '12345678',
            });

            expect(signInResponse.status).toBe(201);
            expect(signInResponse.body.email).toBe('test+1@mail.ru');
        });

        it('should logout user with valid access token', async () => {
            const signUpResponse = await request(app.getHttpServer()).post('/auth/sign-up').send({
                email: 'test+2@mail.ru',
                password: '12345678',
                passwordConfirmation: '12345678',
            });

            const logoutResponse = await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', `Bearer ${signUpResponse.body.accessToken}`);

            expect(logoutResponse.status).toBe(204);
        });

        it('should refresh tokens', async () => {
            const signUpResponse = await request(app.getHttpServer()).post('/auth/sign-up').send({
                email: 'test+3@mail.ru',
                password: '12345678',
                passwordConfirmation: '12345678',
            });

            const refreshTokensResponse = await request(app.getHttpServer())
                .get('/auth/refresh')
                .set('Authorization', `Bearer ${signUpResponse.body.refreshToken}`);

            expect(refreshTokensResponse.status).toBe(200);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});

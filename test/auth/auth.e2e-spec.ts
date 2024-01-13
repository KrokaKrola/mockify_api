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
            const signUpResponse = await e2eUtilsService.authorizeUserAndGetAccessToken(app);

            const signInResponse = await request(app.getHttpServer()).post('/auth/sign-in').send({
                email: signUpResponse.email,
                password: '12345678',
            });

            expect(signInResponse.status).toBe(201);
            expect(signInResponse.body.email).toBe(signUpResponse.email);
        });

        it('should logout user with valid access token', async () => {
            const signUpResponse = await e2eUtilsService.authorizeUserAndGetAccessToken(app);

            const logoutResponse = await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', `Bearer ${signUpResponse.accessToken}`);

            expect(logoutResponse.status).toBe(204);
        });

        it('should refresh tokens', async () => {
            const signUpResponse = await e2eUtilsService.authorizeUserAndGetAccessToken(app);

            const refreshTokensResponse = await request(app.getHttpServer())
                .get('/auth/refresh')
                .set('Authorization', `Bearer ${signUpResponse.refreshToken}`);

            expect(refreshTokensResponse.status).toBe(200);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});

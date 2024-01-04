import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as request from 'supertest';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { AppModule } from '../../src/app.module';
import { ValidationTransformPipe } from '../../src/infra/rest/pipes/validation-transform.pipe';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let container: StartedTestContainer;

    beforeAll(async () => {
        console.log('Starting PostgreSQL container...');

        try {
            container = await new GenericContainer('postgres:latest')
                .withExposedPorts({
                    container: 5432,
                    host: 5435,
                })
                .withEnvironment({
                    POSTGRES_DB: 'mockify_db',
                    POSTGRES_USER: 'mockify_u',
                    POSTGRES_PASSWORD: 'mockify_p',
                })
                .start();

            console.log('PostgreSQL container started successfully.');
        } catch (error) {
            console.error('Error starting PostgreSQL container:', error);

            throw error;
        }
    });

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.use(helmet());
        app.use(cookieParser());
        app.use(bodyParser.json({ limit: '50mb' }));

        app.useGlobalPipes(new ValidationTransformPipe());

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
        await container.stop();
    });
});

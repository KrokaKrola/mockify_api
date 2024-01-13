import { Test } from '@nestjs/testing';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as request from 'supertest';

import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { ValidationTransformPipe } from '../../src/infra/rest/pipes/validation-transform.pipe';

export class E2EUtilsService {
    public async initApp(): Promise<INestApplication> {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        const app = moduleFixture.createNestApplication();

        app.use(helmet());
        app.use(cookieParser());
        app.use(bodyParser.json({ limit: '50mb' }));

        app.useGlobalPipes(new ValidationTransformPipe());

        return app;
    }

    public async authorizeUserAndGetAccessToken(app: INestApplication): Promise<{
        accessToken: string;
        refreshToken: string;
        email: string;
    }> {
        const emailQuantifier = Math.floor(Math.random() * (9999999 - 1 + 1)) + 1;
        const signUpResponse = await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send({
                email: `test+${emailQuantifier}@mail.com`,
                password: '12345678',
                passwordConfirmation: '12345678',
            })
            .expect(201);

        return {
            accessToken: signUpResponse.body.accessToken,
            email: signUpResponse.body.email,
            refreshToken: signUpResponse.body.refreshToken,
        };
    }
}

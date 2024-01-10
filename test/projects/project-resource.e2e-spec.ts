import * as request from 'supertest';

import type { INestApplication } from '@nestjs/common';

import { E2EUtilsService } from '../utils/e2e-utils.service';

describe('Project - Resource (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;

    const e2eUtilsService: E2EUtilsService = new E2EUtilsService();

    beforeAll(async () => {
        app = await e2eUtilsService.initApp();

        await app.init();

        accessToken = await e2eUtilsService.authorizeUserAndGetAccessToken(app);
    });

    describe('create resource', () => {
        it('should create resource', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            expect(createProjectResponse.body.name).toBe('Test project');

            const createResourceResponse = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource',
                })
                .expect(201);

            expect(createResourceResponse.body.name).toBe('Test resource');
            expect(createResourceResponse.body.fields.length).toBe(1);
            expect(createResourceResponse.body.fields[0].name).toBe('id');
            expect(createResourceResponse.body.fields[0].fieldType).toBe('primaryKey');

            let getResourcesResponse = await request(app.getHttpServer())
                .get(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(getResourcesResponse.body.resources.length).toBeGreaterThan(0);
            expect(getResourcesResponse.body.resources[0].name).toBe('Test resource');
            expect(getResourcesResponse.body.resources[0].id).toBe(createResourceResponse.body.id);

            await request(app.getHttpServer())
                .delete(
                    `/projects/${createProjectResponse.body.id}/resources/${createResourceResponse.body.id}`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);

            getResourcesResponse = await request(app.getHttpServer())
                .get(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(getResourcesResponse.body.resources.length).toBe(0);

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });

        it('should not create resource if user already has 20 resources', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            expect(createProjectResponse.body.name).toBe('Test project');

            const resources = new Array(20).fill(0).map((_, index) => index + 1);

            for (const resource of resources) {
                await request(app.getHttpServer())
                    .post(`/projects/${createProjectResponse.body.id}/resources`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        name: `Test resource ${resource}`,
                    })
                    .expect(201);
            }

            const createResourceResponse = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource 21',
                })
                .expect(409);

            expect(createResourceResponse.body.message).toBe('Maximum number of resources reached');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });

        it('should not create resource if resource with this name already exists', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            expect(createProjectResponse.body.name).toBe('Test project');

            const createResourceResponse = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource',
                })
                .expect(201);

            expect(createResourceResponse.body.name).toBe('Test resource');

            const createResourceResponse2 = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource',
                })
                .expect(409);

            expect(createResourceResponse2.body.message).toBe(
                'Resource with this name already exists',
            );

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });
    });
});

import * as request from 'supertest';

import type { INestApplication } from '@nestjs/common';

import { E2EUtilsService } from '../utils/e2e-utils.service';

describe('Projects (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;

    const e2eUtilsService: E2EUtilsService = new E2EUtilsService();

    beforeAll(async () => {
        app = await e2eUtilsService.initApp();

        await app.init();

        accessToken = await e2eUtilsService.authorizeUserAndGetAccessToken(app);
    });

    describe('project crud operations', () => {
        it('should create project', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            expect(createProjectResponse.body.name).toBe('Test project');

            const getProjectsResponse = await request(app.getHttpServer())
                .get('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(getProjectsResponse.body.projects.length).toBeGreaterThan(0);
            expect(getProjectsResponse.body.projects[0].name).toBe('Test project');
            expect(getProjectsResponse.body.projects[0].id).toBe(createProjectResponse.body.id);
        });

        it('should update project', async () => {
            const getProjectsResponse = await request(app.getHttpServer())
                .get('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            const updateProjectResponse = await request(app.getHttpServer())
                .patch(`/projects/${getProjectsResponse.body.projects[0].id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Updated project',
                })
                .expect(200);

            expect(updateProjectResponse.body.name).toBe('Updated project');
        });

        it('should delete project', async () => {
            const getProjectsResponse = await request(app.getHttpServer())
                .get('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            await request(app.getHttpServer())
                .delete(`/projects/${getProjectsResponse.body.projects[0].id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});

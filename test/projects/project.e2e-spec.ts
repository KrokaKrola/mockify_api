import * as request from 'supertest';

import type { INestApplication } from '@nestjs/common';

import { E2EUtilsService } from '../utils/e2e-utils.service';

describe('Project (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;

    const e2eUtilsService: E2EUtilsService = new E2EUtilsService();

    beforeAll(async () => {
        app = await e2eUtilsService.initApp();

        await app.init();

        accessToken = await e2eUtilsService.authorizeUserAndGetAccessToken(app);
    });

    describe('create project', () => {
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

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });

        it('should not create project if user already has 5 projects', async () => {
            const projects = new Array(5).fill(0).map((_, index) => index + 1);

            for (const project of projects) {
                await request(app.getHttpServer())
                    .post('/projects')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        name: `Test project ${project}`,
                    })
                    .expect(201);
            }

            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project 6',
                })
                .expect(409);

            expect(createProjectResponse.body.message).toBe('User already has 5 projects');

            const getProjectsResponse = await request(app.getHttpServer())
                .get('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            for (const project of getProjectsResponse.body.projects) {
                await request(app.getHttpServer())
                    .delete(`/projects/${project.id}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .expect(204);
            }
        });

        it('should not create project if project with the same name already exists', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            expect(createProjectResponse.body.name).toBe('Test project');

            const createProjectResponse2 = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(409);

            expect(createProjectResponse2.body.message).toBe('Project already exists');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });
    });

    describe('update project', () => {
        it('should update project', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            const updateProjectResponse = await request(app.getHttpServer())
                .patch(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Updated project',
                })
                .expect(200);

            expect(updateProjectResponse.body.name).toBe('Updated project');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });

        it('should not update project if project does not exist', async () => {
            const updateProjectResponse = await request(app.getHttpServer())
                .patch(`/projects/1`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Updated project',
                })
                .expect(404);

            expect(updateProjectResponse.body.message).toBe('Project not found');

            await request(app.getHttpServer())
                .delete(`/projects/1`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });

        it('should not update project if project does not belong to user', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            const newToken = await e2eUtilsService.authorizeUserAndGetAccessToken(app);

            const updateProjectResponse = await request(app.getHttpServer())
                .patch(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${newToken}`)
                .send({
                    name: 'Updated project',
                })
                .expect(404);

            expect(updateProjectResponse.body.message).toBe('Project not found');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });
    });

    describe('delete project', () => {
        it('should delete project', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });

        it('should not delete project if project does not exist', async () => {
            const deleteProjectResponse = await request(app.getHttpServer())
                .delete(`/projects/1`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);

            expect(deleteProjectResponse.body.message).toBe('Project not found');
        });

        it('should not delete project if project does not belong to user', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            const newToken = await e2eUtilsService.authorizeUserAndGetAccessToken(app);

            const deleteProjectResponse = await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${newToken}`)
                .expect(404);

            expect(deleteProjectResponse.body.message).toBe('Project not found');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});

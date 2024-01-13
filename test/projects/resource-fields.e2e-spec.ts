import * as crypto from 'crypto';

import * as request from 'supertest';

import type { INestApplication } from '@nestjs/common';

import { E2EUtilsService } from '../utils/e2e-utils.service';

describe('Project - Resource Fields (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;

    const e2eUtilsService: E2EUtilsService = new E2EUtilsService();

    beforeAll(async () => {
        app = await e2eUtilsService.initApp();
        await app.init();
        const response = await e2eUtilsService.authorizeUserAndGetAccessToken(app);
        accessToken = response.accessToken;
    });

    describe('create field', () => {
        it('should create a field', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            const createResourceResponse = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource',
                })
                .expect(201);

            await request(app.getHttpServer())
                .post(
                    `/projects/${createProjectResponse.body.id}/resources/${createResourceResponse.body.id}/fields`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'string_field',
                    fieldType: 'string',
                    value: 'test',
                })
                .expect(201);

            await request(app.getHttpServer())
                .post(
                    `/projects/${createProjectResponse.body.id}/resources/${createResourceResponse.body.id}/fields`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'number_field',
                    fieldType: 'number',
                    value: 100,
                })
                .expect(201);

            const getResourceResponse = await request(app.getHttpServer())
                .get(`/projects/${createProjectResponse.body.id}/resources/`)
                .set('Authorization', `Bearer ${accessToken}`);

            const fields = getResourceResponse.body.resources[0].fields;

            expect(fields).toHaveLength(3);
            expect(fields[0].name).toBe('id');
            expect(fields[0].fieldType).toBe('primaryKey');
            expect(fields[1].name).toBe('string_field');
            expect(fields[1].fieldType).toBe('string');
            // expect(fields[1].value).toBe('test');
            expect(fields[2].name).toBe('number_field');
            expect(fields[2].fieldType).toBe('number');
            // expect(fields[2].value).toBe(100);

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
        });

        it('should not create a field if the project does not exist', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            const createResourceResponse = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource',
                })
                .expect(201);

            const fieldResourceResponse = await request(app.getHttpServer())
                .post(`/projects/99999/resources/${createResourceResponse.body.id}/fields`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'string_field',
                    fieldType: 'string',
                    value: 'test',
                })
                .expect(404);

            expect(fieldResourceResponse.body.message).toBe('Project not found');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
        });

        it('should not create a field if the resource does not exist', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            const fieldResourceResponse = await request(app.getHttpServer())
                .post(
                    `/projects/${
                        createProjectResponse.body.id
                    }/resources/${crypto.randomUUID()}/fields`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'string_field',
                    fieldType: 'string',
                    value: 'test',
                })
                .expect(404);

            expect(fieldResourceResponse.body.message).toBe('Resource not found');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
        });

        it('should not create a field if the resource already has 20 fields', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            const createResourceResponse = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource',
                })
                .expect(201);

            for (let i = 0; i < 19; i++) {
                await request(app.getHttpServer())
                    .post(
                        `/projects/${createProjectResponse.body.id}/resources/${createResourceResponse.body.id}/fields`,
                    )
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        name: `string_field_${i}`,
                        fieldType: 'string',
                        value: 'test',
                    })
                    .expect(201);
            }

            const fieldResourceResponse = await request(app.getHttpServer())
                .post(
                    `/projects/${createProjectResponse.body.id}/resources/${createResourceResponse.body.id}/fields`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: `string_field_20`,
                    fieldType: 'string',
                    value: 'test',
                })
                .expect(409);

            expect(fieldResourceResponse.body.message).toBe(
                'Resource "Test resource" already has 20 fields',
            );

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
        });
    });

    describe('update field', () => {
        it('should update a field', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project ' + e2eUtilsService.getRandomQuantifier(),
                })
                .expect(201);

            const createResourceResponse = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource ' + e2eUtilsService.getRandomQuantifier(),
                })
                .expect(201);

            const createFieldResponse = await request(app.getHttpServer())
                .post(
                    `/projects/${createProjectResponse.body.id}/resources/${createResourceResponse.body.id}/fields`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'string_field' + e2eUtilsService.getRandomQuantifier(),
                    fieldType: 'string',
                    value: 'test',
                })
                .expect(201);

            const updatedFieldName =
                'string_field_updated' + +e2eUtilsService.getRandomQuantifier();

            await request(app.getHttpServer())
                .patch(
                    `/projects/${createProjectResponse.body.id}/resources/${createResourceResponse.body.id}/fields/${createFieldResponse.body.id}`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: updatedFieldName,
                    fieldType: 'string',
                    value: 'test_updated',
                })
                .expect(200);

            const getResourceResponse = await request(app.getHttpServer())
                .get(`/projects/${createProjectResponse.body.id}/resources/`)
                .set('Authorization', `Bearer ${accessToken}`);

            const fields = getResourceResponse.body.resources[0].fields;

            expect(fields).toHaveLength(2);
            expect(fields[0].name).toBe('id');
            expect(fields[0].fieldType).toBe('primaryKey');
            expect(fields[1].name).toBe(updatedFieldName);
            expect(fields[1].fieldType).toBe('string');
            // expect(fields[1].value).toBe('test_updated');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
        });

        it('should not update a field if the project does not exist', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project ' + e2eUtilsService.getRandomQuantifier(),
                })
                .expect(201);

            const createResourceResponse = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource ' + e2eUtilsService.getRandomQuantifier(),
                })
                .expect(201);

            const createFieldResponse = await request(app.getHttpServer())
                .post(
                    `/projects/${createProjectResponse.body.id}/resources/${createResourceResponse.body.id}/fields`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'string_field' + e2eUtilsService.getRandomQuantifier(),
                    fieldType: 'string',
                    value: 'test',
                })
                .expect(201);

            const fieldResourceResponse = await request(app.getHttpServer())
                .patch(
                    `/projects/99999/resources/${createResourceResponse.body.id}/fields/${createFieldResponse.body.id}`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'string_field_updated' + e2eUtilsService.getRandomQuantifier(),
                    fieldType: 'string',
                    value: 'test_updated',
                })
                .expect(404);

            expect(fieldResourceResponse.body.message).toBe('Project not found');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
        });

        it('should not update a field if the resource does not exist', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project ' + e2eUtilsService.getRandomQuantifier(),
                })
                .expect(201);

            const createFieldResponse = await request(app.getHttpServer())
                .post(
                    `/projects/${
                        createProjectResponse.body.id
                    }/resources/${crypto.randomUUID()}/fields`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'string_field' + e2eUtilsService.getRandomQuantifier(),
                    fieldType: 'string',
                    value: 'test',
                })
                .expect(404);

            expect(createFieldResponse.body.message).toBe('Resource not found');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
        });

        it('should not update a field if the field does not exist', async () => {
            const createProjectResponse = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project ' + e2eUtilsService.getRandomQuantifier(),
                })
                .expect(201);

            const createResourceResponse = await request(app.getHttpServer())
                .post(`/projects/${createProjectResponse.body.id}/resources`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test resource ' + e2eUtilsService.getRandomQuantifier(),
                })
                .expect(201);

            const fieldResourceResponse = await request(app.getHttpServer())
                .patch(
                    `/projects/${createProjectResponse.body.id}/resources/${
                        createResourceResponse.body.id
                    }/fields/${crypto.randomUUID()}`,
                )
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'string_field_updated' + e2eUtilsService.getRandomQuantifier(),
                    fieldType: 'string',
                    value: 'test_updated',
                })
                .expect(404);

            expect(fieldResourceResponse.body.message).toBe('Field not found');

            await request(app.getHttpServer())
                .delete(`/projects/${createProjectResponse.body.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
        });
    });
});

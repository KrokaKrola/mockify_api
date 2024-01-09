import * as request from 'supertest';

import type { INestApplication } from '@nestjs/common';

import { ProjectRepository } from '../../src/infra/database/postgres/repositories/project.repository';
import { E2EUtilsService } from '../utils/e2e-utils.service';

describe('Projects (e2e)', () => {
    let app: INestApplication;
    let projectRepository: ProjectRepository;
    let accessToken: string;

    const e2eUtilsService: E2EUtilsService = new E2EUtilsService();

    beforeAll(async () => {
        app = await e2eUtilsService.initApp();

        await app.init();

        projectRepository = app.get(ProjectRepository);

        accessToken = await e2eUtilsService.authorizeUserAndGetAccessToken(app);
    });

    describe('project crud operations', () => {
        it('should create project', async () => {
            const response = await request(app.getHttpServer())
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Test project',
                })
                .expect(201);

            const project = await projectRepository.findOne({
                where: { publicId: response.body.id },
            });

            expect(response.body.name).toBe('Test project');
            expect(project).toBeDefined();
            expect(project.name).toBe('Test project');
        });
    });

    afterAll(async () => {
        await app.close();
    });
});

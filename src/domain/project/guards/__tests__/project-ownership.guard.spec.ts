import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import type { ExecutionContext } from '@nestjs/common';

import { ProjectMapper } from '../../../../infra/database/postgres/mappers/project.mapper';
import { PostgresModule } from '../../../../infra/database/postgres/postgres.module';
import { ProjectRepository } from '../../../../infra/database/postgres/repositories/project.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';
import { AppConfigModule } from '../../../../infra/ioc/app-config/app-config.module';
import { ProjectEntity } from '../../entities/project.entity';
import { ProjectOwnershipGuard } from '../project-ownership.guard';

describe('ProjectOwnershipGuard', () => {
    let guard: ProjectOwnershipGuard;
    let projectRepository: ProjectRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppConfigModule, PostgresModule, TypeOrmModule.forFeature([ProjectMapper])],
            providers: [ProjectOwnershipGuard, ProjectRepository],
        }).compile();

        guard = moduleRef.get<ProjectOwnershipGuard>(ProjectOwnershipGuard);
        projectRepository = moduleRef.get<ProjectRepository>(ProjectRepository);
    });

    it('should return error if not existed project was requested', async () => {
        const executionContext = {
            switchToHttp: () => ({
                getRequest: (): unknown => ({
                    params: {
                        // project id
                        id: 1,
                    },
                    user: {
                        id: 1,
                    },
                }),
            }),
        } as ExecutionContext;

        jest.spyOn(projectRepository, 'findProjectById').mockImplementation(() => {
            return Promise.resolve(null);
        });

        try {
            await guard.canActivate(executionContext);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Project not found (1)');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });

    it('should return error if user that doesnt own project request it', async () => {
        const executionContext = {
            switchToHttp: () => ({
                getRequest: (): unknown => ({
                    params: {
                        // project id
                        id: 1,
                    },
                    user: {
                        id: 2,
                    },
                }),
            }),
        } as ExecutionContext;

        jest.spyOn(projectRepository, 'findProjectById').mockImplementation(() => {
            return Promise.resolve(new ProjectEntity('Project', 1));
        });

        try {
            await guard.canActivate(executionContext);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Project not found (2)');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });
});

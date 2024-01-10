import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMapper } from '../../../../infra/database/postgres/mappers/project.mapper';
import { PostgresModule } from '../../../../infra/database/postgres/postgres.module';
import { ProjectRepository } from '../../../../infra/database/postgres/repositories/project.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';
import { AppConfigModule } from '../../../../infra/ioc/app-config/app-config.module';
import { ProjectEntity } from '../../entities/project.entity';
import { ProjectService } from '../project.service';

describe('ProjectService', () => {
    let service: ProjectService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppConfigModule, PostgresModule, TypeOrmModule.forFeature([ProjectMapper])],
            providers: [ProjectRepository, ProjectService],
        }).compile();

        service = moduleRef.get<ProjectService>(ProjectService);
    });

    it('should return exception if project not found', async () => {
        jest.spyOn(service, 'validateAndCheckExistence').mockImplementation(() => {
            return Promise.resolve(null);
        });

        try {
            await service.validateAndCheckExistence(1, 1);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Project not found');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });

    it('should return exception on modifying project assigned to another user', async () => {
        jest.spyOn(service, 'validateAndCheckExistence').mockImplementation(() => {
            return Promise.resolve(new ProjectEntity('name', 2, 1));
        });

        try {
            await service.validateAndCheckExistence(1, 1);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Project not found');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });
});

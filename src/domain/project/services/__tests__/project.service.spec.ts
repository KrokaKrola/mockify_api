import { Test } from '@nestjs/testing';

import { ProjectRepository } from '../../../../infra/database/postgres/repositories/project.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';
import { ProjectEntity } from '../../entities/project.entity';
import { ProjectService } from '../project.service';

describe('ProjectService', () => {
    let service: ProjectService;
    let projectRepositoryMock: jest.Mocked<ProjectRepository>;

    beforeAll(async () => {
        const mockRepository: Partial<ProjectRepository> = {
            findByPublicId: jest.fn(),
            findById: jest.fn(),
        };

        projectRepositoryMock = mockRepository as jest.Mocked<ProjectRepository>;

        const moduleRef = await Test.createTestingModule({
            providers: [
                ProjectService,
                {
                    provide: ProjectRepository,
                    useValue: projectRepositoryMock,
                },
            ],
        }).compile();

        service = moduleRef.get<ProjectService>(ProjectService);
    });

    it('should return exception if project not found', async () => {
        projectRepositoryMock.findById.mockResolvedValueOnce(null);

        try {
            await service.validateAndCheckExistence(1, 1);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Project not found');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });

    it('should return exception on modifying project assigned to another user', async () => {
        projectRepositoryMock.findById.mockResolvedValueOnce(new ProjectEntity('name', 2, 1));

        try {
            await service.validateAndCheckExistence(1, 1);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Project not found');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });
});

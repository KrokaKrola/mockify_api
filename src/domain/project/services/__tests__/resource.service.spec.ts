import * as crypto from 'node:crypto';

import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';
import { ResourceService } from '../resource.service';

import type { ResourceEntity } from '../../entities/resource.entity';

describe('ResourceService', () => {
    let resourceService: ResourceService;
    let resourceRepositoryMock: jest.Mocked<ResourceRepository>;

    beforeEach(async () => {
        const mockRepository: Partial<ResourceRepository> = {
            findByPublicId: jest.fn(),
        };

        resourceRepositoryMock = mockRepository as jest.Mocked<ResourceRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ResourceService,
                {
                    provide: ResourceRepository,
                    useValue: resourceRepositoryMock,
                },
                ResourceService,
            ],
        }).compile();

        resourceService = module.get<ResourceService>(ResourceService);
    });

    describe('validateAndCheckExistence', () => {
        it('should throw ResourceNotFoundException if resource does not exist', async () => {
            resourceRepositoryMock.findByPublicId.mockResolvedValueOnce(null);

            try {
                await resourceService.validateAndCheckExistence(1, crypto.randomUUID());
            } catch (error) {
                expect(error.status).toBe(404);
                expect(error.message).toBe('Resource not found');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw ResourceNotFoundException if resource does not belong to project', async () => {
            resourceRepositoryMock.findByPublicId.mockResolvedValueOnce({
                projectId: 2,
            } as ResourceEntity);

            try {
                await resourceService.validateAndCheckExistence(1, crypto.randomUUID());
            } catch (err) {
                expect(err.status).toBe(404);
                expect(err.message).toBe('Resource not found');
                expect(err).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should return resource if it exists and belongs to project', async () => {
            const resource = {
                projectId: 1,
            } as ResourceEntity;

            resourceRepositoryMock.findByPublicId.mockResolvedValueOnce(resource);

            const result = await resourceService.validateAndCheckExistence(1, 'resource-id');

            expect(result).toBe(resource);
        });
    });
});

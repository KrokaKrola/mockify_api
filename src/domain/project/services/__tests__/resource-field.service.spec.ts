import * as crypto from 'node:crypto';

import { Test } from '@nestjs/testing';

import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';
import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';
import { ResourceFieldEntity } from '../../entities/resource-field.entity';
import { ResourceEntity } from '../../entities/resource.entity';
import { FieldTypeEnum } from '../../enums/field-type.enum';
import { ResourceFieldService } from '../resource-field.service';

describe('ResourceFieldService', () => {
    let service: ResourceFieldService;
    let resourceFieldRepositoryMock: jest.Mocked<ResourceFieldRepository>;
    let resourceRepositoryMock: jest.Mocked<ResourceRepository>;

    beforeEach(async () => {
        const mockRepository: Partial<ResourceFieldRepository> = {
            findByPublicId: jest.fn(),
        };

        const mockResourceRepository: Partial<ResourceRepository> = {
            findByPublicId: jest.fn(),
        };

        resourceFieldRepositoryMock = mockRepository as jest.Mocked<ResourceFieldRepository>;
        resourceRepositoryMock = mockResourceRepository as jest.Mocked<ResourceRepository>;

        const moduleRef = await Test.createTestingModule({
            providers: [
                ResourceFieldService,
                {
                    provide: ResourceFieldRepository,
                    useValue: resourceFieldRepositoryMock,
                },
                {
                    provide: ResourceRepository,
                    useValue: resourceRepositoryMock,
                },
            ],
        }).compile();

        service = moduleRef.get<ResourceFieldService>(ResourceFieldService);
    });

    it('should return exception if field not found', async () => {
        resourceFieldRepositoryMock.findByPublicId.mockResolvedValueOnce(null);

        try {
            await service.validateAndCheckExistence(crypto.randomUUID(), crypto.randomUUID());
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Field not found');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });

    it('should return exception on modifying field assigned to another resource', async () => {
        resourceFieldRepositoryMock.findByPublicId.mockResolvedValueOnce(
            new ResourceFieldEntity('name', FieldTypeEnum.ARRAY, 1, crypto.randomUUID()),
        );

        resourceRepositoryMock.findByPublicId.mockResolvedValueOnce(
            new ResourceEntity('name', 1, crypto.randomUUID(), 2),
        );

        try {
            await service.validateAndCheckExistence(crypto.randomUUID(), crypto.randomUUID());
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Field not found');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });

    it('should return exception if field is primary key', async () => {
        resourceFieldRepositoryMock.findByPublicId.mockResolvedValueOnce(
            new ResourceFieldEntity('name', FieldTypeEnum.PRIMARY_KEY, 1, crypto.randomUUID()),
        );

        resourceRepositoryMock.findByPublicId.mockResolvedValueOnce(
            new ResourceEntity('name', 1, crypto.randomUUID(), 1),
        );

        try {
            await service.validateAndCheckExistence(crypto.randomUUID(), crypto.randomUUID());
        } catch (error) {
            expect(error.status).toBe(422);
            expect(error.message).toBe('Unprocessable Entity Exception');
            expect(error.response).toStrictEqual({
                error: 'Unprocessable Entity',
                message: [
                    {
                        constraints: { primaryKey: 'Primary key field cannot be deleted' },
                        errors: ['primaryKey'],
                        property: 'fieldType',
                    },
                ],
                statusCode: 422,
            });
        }
    });
});

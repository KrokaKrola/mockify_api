import * as crypto from 'node:crypto';

import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import type { ExecutionContext } from '@nestjs/common';

import { ResourceMapper } from '../../../../infra/database/postgres/mappers/resource.mapper';
import { PostgresModule } from '../../../../infra/database/postgres/postgres.module';
import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';
import { AppConfigModule } from '../../../../infra/ioc/app-config/app-config.module';
import { ResourceEntity } from '../../entities/resource.entity';
import { ResourceOwnershipGuard } from '../resource-ownership.guard';

describe('ResourceOwnershipGuard', () => {
    let guard: ResourceOwnershipGuard;
    let resourceRepository: ResourceRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppConfigModule, PostgresModule, TypeOrmModule.forFeature([ResourceMapper])],
            providers: [ResourceOwnershipGuard, ResourceRepository],
        }).compile();

        guard = moduleRef.get<ResourceOwnershipGuard>(ResourceOwnershipGuard);
        resourceRepository = moduleRef.get<ResourceRepository>(ResourceRepository);
    });

    it('should return error if not existed resource was requested', async () => {
        const executionContext = {
            switchToHttp: () => ({
                getRequest: (): unknown => ({
                    params: {
                        // project id
                        id: 1,
                        // resource id
                        resourceId: 1,
                    },
                }),
            }),
        } as ExecutionContext;

        jest.spyOn(resourceRepository, 'findByPublicId').mockImplementation(() => {
            return Promise.resolve(null);
        });

        try {
            await guard.canActivate(executionContext);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Resource not found (1)');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });

    it('should return error if user that doesnt own resource request it', async () => {
        const executionContext = {
            switchToHttp: () => ({
                getRequest: (): unknown => ({
                    params: {
                        // project id
                        id: 1,
                        // resource id
                        resourceId: 1,
                    },
                }),
            }),
        } as ExecutionContext;

        jest.spyOn(resourceRepository, 'findByPublicId').mockImplementation(() => {
            return Promise.resolve(new ResourceEntity('resource_1', 2, crypto.randomUUID()));
        });

        try {
            await guard.canActivate(executionContext);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Resource not found (2)');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });
});

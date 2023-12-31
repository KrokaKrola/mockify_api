import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourceFieldMapper } from '../../../../infra/database/postgres/mappers/resource-field.mapper';
import { PostgresModule } from '../../../../infra/database/postgres/postgres.module';
import { ResourceFieldRepository } from '../../../../infra/database/postgres/repositories/resource-field.repository';
import { ResourceNotFoundException } from '../../../../infra/exceptions/resource-not-found.exception';
import { AppConfigModule } from '../../../../infra/ioc/app-config/app-config.module';
import { ResourceFieldEntity } from '../../entities/resource-field.entity';
import { FieldTypeEnum } from '../../enums/field-type.enum';
import { ResourceFieldService } from '../resource-field.service';

describe('ResourceFieldService', () => {
    let service: ResourceFieldService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                AppConfigModule,
                PostgresModule,
                TypeOrmModule.forFeature([ResourceFieldMapper]),
            ],
            providers: [ResourceFieldRepository, ResourceFieldService],
        }).compile();

        service = moduleRef.get<ResourceFieldService>(ResourceFieldService);
    });

    it('should return exception if field not found', async () => {
        jest.spyOn(service, 'validateAndCheckDeletability').mockImplementation(() => {
            return Promise.resolve(null);
        });

        try {
            await service.validateAndCheckDeletability(1, 1);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Field not found');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });

    it('should return field assigned to another resource', async () => {
        jest.spyOn(service, 'validateAndCheckDeletability').mockImplementation(() => {
            return Promise.resolve(new ResourceFieldEntity('name', FieldTypeEnum.ARRAY, 2, 2));
        });

        try {
            await service.validateAndCheckDeletability(1, 1);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Field not found');
            expect(error).toBeInstanceOf(ResourceNotFoundException);
        }
    });

    it('should return exception if field is primary key', async () => {
        jest.spyOn(service, 'validateAndCheckDeletability').mockImplementation(() => {
            return Promise.resolve(
                new ResourceFieldEntity('name', FieldTypeEnum.PRIMARY_KEY, 1, 1),
            );
        });

        try {
            await service.validateAndCheckDeletability(1, 1);
        } catch (error) {
            expect(error.status).toBe(422);
            expect(error.message).toBe('Field not found');
            expect(error.response).toStrictEqual([
                {
                    property: 'fieldType',
                    errors: ['primaryKey'],
                    constraints: {
                        primaryKey: 'Primary key field cannot be deleted',
                    },
                },
            ]);
        }
    });
});

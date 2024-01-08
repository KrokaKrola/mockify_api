import { TableColumn } from 'typeorm';

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterResourceFieldsNullableResourceId1704742045410 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'resource_fields',
            'resource_id',
            new TableColumn({
                name: 'resource_id',
                type: 'int',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'resource_fields',
            'resource_id',
            new TableColumn({
                name: 'resource_id',
                type: 'int',
                isNullable: false,
            }),
        );
    }
}

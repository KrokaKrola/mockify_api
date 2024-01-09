import { TableColumn } from 'typeorm';

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterResourcesAddPublicIdColumn1704778946524 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'resource_fields',
            new TableColumn({
                name: 'public_id',
                type: 'uuid',
                isNullable: false,
                generationStrategy: 'uuid',
                isGenerated: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('resource_fields', 'public_id');
    }
}

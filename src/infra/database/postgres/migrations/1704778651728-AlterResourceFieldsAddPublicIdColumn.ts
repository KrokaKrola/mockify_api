import { TableColumn } from 'typeorm';

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterResourceFieldsAddPublicIdColumn1704778651728 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'resources',
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
        await queryRunner.dropColumn('resources', 'public_id');
    }
}

import { TableForeignKey } from 'typeorm';

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterResourceFieldsAddForeinKeyToResourceId1704741769755
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'resource_fields',
            new TableForeignKey({
                columnNames: ['resource_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'resources',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('resource_fields');
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('resource_id') !== -1,
        );

        await queryRunner.dropForeignKey('resource_fields', foreignKey);
    }
}

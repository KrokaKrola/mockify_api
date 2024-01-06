import { Table } from 'typeorm';

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectEntryFieldsTable1704567471989 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'project_entry_fields',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'field_type',
                        type: 'enum',
                        enum: [
                            'primaryKey',
                            'string',
                            'number',
                            'boolean',
                            'array',
                            'date',
                            'createdAt',
                            'updatedAt',
                            'deletedAt',
                            'childResource',
                            'parentResource',
                            'faker',
                        ],
                    },
                    {
                        name: 'value',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'entry_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('project_entries_fields');
    }
}

import { Table, TableForeignKey } from 'typeorm';

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersProjectsProjectEntitiesTables1704354890221 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: false,
                        length: '255',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: true,
                        length: '500',
                    },
                    {
                        name: 'refresh_token',
                        type: 'varchar',
                        isNullable: true,
                        length: '255',
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
                        onUpdate: 'now()',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp with time zone',
                        isNullable: true,
                    },
                ],
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'projects',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'project_id',
                        type: 'uuid',
                        isNullable: false,
                        generationStrategy: 'uuid',
                        isGenerated: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
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
                        onUpdate: 'now()',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp with time zone',
                        isNullable: true,
                    },
                    {
                        name: 'userId',
                        type: 'integer',
                        isNullable: false,
                    },
                ],
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'project_entries',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
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
                        onUpdate: 'now()',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp with time zone',
                        isNullable: true,
                    },
                    {
                        name: 'project_id',
                        type: 'integer',
                        isNullable: false,
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'projects',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'project_entries',
            new TableForeignKey({
                columnNames: ['project_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'projects',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const projectEntriesTable = await queryRunner.getTable('project_entries');

        const projectEntriesForeignKey = projectEntriesTable.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('project_id') !== -1,
        );

        const projectsTable = await queryRunner.getTable('projects');

        const projectsForeignKey = projectsTable.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('userId') !== -1,
        );

        await queryRunner.dropForeignKey('project_entries', projectEntriesForeignKey);
        await queryRunner.dropForeignKey('projects', projectsForeignKey);

        await queryRunner.dropTable('project_entries');
        await queryRunner.dropTable('projects');
        await queryRunner.dropTable('users');
    }
}

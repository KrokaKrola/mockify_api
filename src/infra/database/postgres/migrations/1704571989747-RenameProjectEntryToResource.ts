import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameProjectEntryToResource1704571989747 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('resource_fields', 'entry_id', 'resource_id');

        await queryRunner.renameTable('project_entries', 'resources');
        await queryRunner.renameTable('project_entry_fields', 'resource_fields');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('resources', 'project_entries');
        await queryRunner.renameTable('resource_fields', 'project_entry_fields');
    }
}

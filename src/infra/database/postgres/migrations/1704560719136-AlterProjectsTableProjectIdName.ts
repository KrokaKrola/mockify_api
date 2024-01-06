import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProjectsTableProjectIdName1704560719136 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'projects',
            'project_id',
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
        console.log('123');
        await queryRunner.changeColumn(
            'projects',
            'public_id',
            new TableColumn({
                name: 'project_id',
                type: 'uuid',
                isNullable: false,
                generationStrategy: 'uuid',
                isGenerated: true,
            }),
        );
    }
}

import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProjectsTableUserId1704560285320 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'projects',
            'userId',
            new TableColumn({
                name: 'user_id',
                type: 'integer',
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'projects',
            'user_id',
            new TableColumn({
                name: 'userId',
                type: 'integer',
                isNullable: true,
            }),
        );
    }
}

import { EntitySchema } from 'typeorm';

import { ProjectEntryEntity } from '../../../../domain/project/entities/project-entry.entity';
import { ProjectEntity } from '../../../../domain/project/entities/project.entity';

export const ProjectEntryMapper = new EntitySchema<ProjectEntryEntity>({
    name: ProjectEntryEntity.name,
    tableName: 'project_entries',
    target: ProjectEntryEntity,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            name: 'name',
            type: String,
            nullable: false,
        },
        createdAt: {
            name: 'created_at',
            type: 'timestamp with time zone',
            createDate: true,
        },
        updatedAt: {
            name: 'updated_at',
            type: 'timestamp with time zone',
            updateDate: true,
        },
        deletedAt: {
            name: 'deleted_at',
            type: 'timestamp with time zone',
            deleteDate: true,
        },
        projectId: {
            name: 'project_id',
            type: Number,
            nullable: false,
        },
    },
    orderBy: {
        id: 'ASC',
    },
    relations: {
        project: {
            type: 'many-to-one',
            target: ProjectEntity.name,
            inverseSide: 'projectEntries',
        },
    },
});

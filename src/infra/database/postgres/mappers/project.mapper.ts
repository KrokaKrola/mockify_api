import { EntitySchema } from 'typeorm';

import { ProjectEntity } from '../../../../domain/project/entities/project.entity';

export const ProjectMapper = new EntitySchema<ProjectEntity>({
    name: ProjectEntity.name,
    tableName: 'projects',
    target: ProjectEntity,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        projectId: {
            type: 'uuid',
            name: 'project_id',
            nullable: false,
            generated: 'uuid',
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
    },
    orderBy: {
        id: 'ASC',
    },
    relations: {
        projectEntries: {
            type: 'one-to-many',
            target: 'ProjectEntryEntity',
            inverseSide: 'project',
        },
    },
});

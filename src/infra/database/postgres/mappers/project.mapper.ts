import { EntitySchema } from 'typeorm';

import { ProjectEntity } from '../../../../domain/project/entities/project.entity';
import { ResourceEntity } from '../../../../domain/project/entities/resource.entity';

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
        publicId: {
            type: 'uuid',
            name: 'public_id',
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
        userId: {
            name: 'user_id',
            type: Number,
            nullable: false,
        },
    },
    orderBy: {
        id: 'ASC',
    },
    relations: {
        resources: {
            type: 'one-to-many',
            target: ResourceEntity.name,
            inverseSide: 'project',
            cascade: true,
        },
    },
});

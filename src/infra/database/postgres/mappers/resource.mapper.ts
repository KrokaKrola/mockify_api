import { EntitySchema } from 'typeorm';

import { ProjectEntity } from '../../../../domain/project/entities/project.entity';
import { ResourceFieldEntity } from '../../../../domain/project/entities/resource-field.entity';
import { ResourceEntity } from '../../../../domain/project/entities/resource.entity';

export const ResourceMapper = new EntitySchema<ResourceEntity>({
    name: ResourceEntity.name,
    tableName: 'resources',
    target: ResourceEntity,
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
            inverseSide: 'resources',
            joinColumn: {
                name: 'project_id',
            },
        },
        fields: {
            type: 'one-to-many',
            target: ResourceFieldEntity.name,
            inverseSide: 'resource',
            cascade: true,
            onDelete: 'CASCADE',
        },
    },
});

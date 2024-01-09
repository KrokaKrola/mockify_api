import { EntitySchema } from 'typeorm';

import { ProjectEntity } from '../../../../domain/project/entities/project.entity';
import { ResourceFieldEntity } from '../../../../domain/project/entities/resource-field.entity';
import { FieldTypeEnum } from '../../../../domain/project/enums/field-type.enum';

export const ResourceFieldMapper = new EntitySchema<ResourceFieldEntity>({
    name: ResourceFieldEntity.name,
    tableName: 'resource_fields',
    target: ResourceFieldEntity,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            type: String,
        },
        fieldType: {
            type: 'enum',
            enum: Object.keys(FieldTypeEnum),
            name: 'field_type',
        },
        value: {
            type: 'jsonb',
            name: 'value',
            nullable: true,
        },
        resourceId: {
            type: Number,
            name: 'resource_id',
            nullable: true,
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
        publicId: {
            name: 'public_id',
            type: 'uuid',
            generated: 'uuid',
            nullable: false,
        },
    },
    relations: {
        resource: {
            type: 'many-to-one',
            target: ProjectEntity.name,
            inverseSide: 'fields',
            joinColumn: {
                name: 'resource_id',
                referencedColumnName: 'id',
            },
        },
    },
});

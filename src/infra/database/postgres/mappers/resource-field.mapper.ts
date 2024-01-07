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
        },
        value: {
            type: 'jsonb',
            name: 'value',
            nullable: true,
        },
        resourceId: {
            type: Number,
        },
        createdAt: {
            type: Date,
            createDate: true,
        },
        updatedAt: {
            type: Date,
            updateDate: true,
        },
    },
    relations: {
        resource: {
            type: 'many-to-one',
            target: ProjectEntity.name,
            joinColumn: {
                name: 'resource_id',
                referencedColumnName: 'id',
            },
        },
    },
});

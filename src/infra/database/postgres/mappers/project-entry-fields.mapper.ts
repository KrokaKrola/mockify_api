import { EntitySchema } from 'typeorm';

import { ProjectEntryFieldsEntity } from '../../../../domain/project/entities/project-entry-fields.entity';
import { FieldTypeEnum } from '../../../../domain/project/enums/field-type.enum';

export const ProjectEntryFieldsMapper = new EntitySchema<ProjectEntryFieldsEntity>({
    name: ProjectEntryFieldsEntity.name,
    tableName: 'project_entry_fields',
    target: ProjectEntryFieldsEntity,
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
        entryId: {
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
        entry: {
            type: 'many-to-one',
            target: 'project_entries',
            joinColumn: {
                name: 'entry_id',
            },
        },
    },
});

import { FieldTypeEnum } from '../enums/field-type.enum';
import { ProjectEntryEntity } from './project-entry.entity';

export class ProjectEntryFieldsEntity {
    public id: number;

    public name: string;

    public fieldType: FieldTypeEnum;

    public value: string;

    public entryId: number;

    public entry: ProjectEntryEntity;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(name: string, fieldType: FieldTypeEnum, id?: number, entryId?: number) {
        this.name = name;
        this.fieldType = fieldType;
        this.id = id;
        this.entryId = entryId;
    }
}

import type { FieldTypeEnum } from '../enums/field-type.enum';
import type { ResourceEntity } from './resource.entity';

export class ResourceFieldEntity {
    public id: number;

    public name: string;

    public fieldType: FieldTypeEnum;

    public value: unknown;

    public resourceId: number;

    public resource: ResourceEntity;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(name: string, fieldType: FieldTypeEnum, resourceId?: number, id?: number) {
        this.name = name;
        this.fieldType = fieldType;
        this.id = id;
        this.resourceId = resourceId;
    }
}

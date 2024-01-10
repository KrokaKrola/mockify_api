import type { ResourceFieldEntity } from '../../../domain/project/entities/resource-field.entity';
import type { FieldTypeEnum } from '../../../domain/project/enums/field-type.enum';

class ResourceField {
    constructor(id: string, name: string, fieldType: FieldTypeEnum, value: unknown) {
        this.id = id;
        this.name = name;
        this.fieldType = fieldType;
        this.value = value;
    }

    public id: string;

    public name: string;

    public fieldType: FieldTypeEnum;

    public value: unknown;
}

export class CreateResourceResponse {
    constructor(id: string, name: string, fields: ResourceFieldEntity[]) {
        this.id = id;
        this.name = name;
        this.fields = fields.map(
            (e) => new ResourceField(e.publicId, e.name, e.fieldType, e.value),
        );
    }

    public id: string;

    public name: string;

    public fields: ResourceField[];
}

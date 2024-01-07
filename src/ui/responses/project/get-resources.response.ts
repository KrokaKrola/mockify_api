import type { ResourceEntity } from '../../../domain/project/entities/resource.entity';
import type { FieldTypeEnum } from '../../../domain/project/enums/field-type.enum';

class Field {
    constructor(id: number, name: string, fieldType: FieldTypeEnum, value: unknown) {
        this.id = id;
        this.name = name;
        this.fieldType = fieldType;
        this.value = value;
    }

    public id: number;

    public name: string;

    public fieldType: FieldTypeEnum;

    public value: unknown;
}

class Resource {
    constructor(name: string, id: number, fields: Field[]) {
        this.name = name;
        this.id = id;
        this.fields = fields;
    }

    public name: string;

    public id: number;

    public fields: Field[];
}

export class GetResourcesResponse {
    constructor(resources: ResourceEntity[]) {
        this.resources = resources.map(
            (entry) =>
                new Resource(
                    entry.name,
                    entry.id,
                    (entry.fields ?? []).map(
                        (field) => new Field(field.id, field.name, field.fieldType, field.value),
                    ),
                ),
        );
    }

    public resources: Resource[];
}

import type { ResourceEntity } from '../../../domain/project/entities/resource.entity';
import type { FieldTypeEnum } from '../../../domain/project/enums/field-type.enum';

class Field {
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

class Resource {
    constructor(name: string, id: string, fields: Field[]) {
        this.name = name;
        this.id = id;
        this.fields = fields;
    }

    public name: string;

    public id: string;

    public fields: Field[];
}

export class GetResourcesResponse {
    constructor(resources: ResourceEntity[]) {
        this.resources = resources.map(
            (entry) =>
                new Resource(
                    entry.name,
                    entry.publicId,
                    (entry.fields ?? []).map(
                        (field) =>
                            new Field(field.publicId, field.name, field.fieldType, field.value),
                    ),
                ),
        );
    }

    public resources: Resource[];
}

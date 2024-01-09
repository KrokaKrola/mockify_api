import type { ResourceFieldEntity } from '../../../domain/project/entities/resource-field.entity';

export class CreateResourceResponse {
    constructor(id: string, name: string, fields: ResourceFieldEntity[]) {
        this.id = id;
        this.name = name;
        this.fields = fields;
    }

    public id: string;

    public name: string;

    public fields: ResourceFieldEntity[];
}

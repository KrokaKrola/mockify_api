import type { ResourceFieldEntity } from '../../../domain/project/entities/resource-field.entity';

export class CreateResourceResponse {
    constructor(id: number, name: string, fields: ResourceFieldEntity[]) {
        this.id = id;
        this.name = name;
        this.fields = fields;
    }

    public id: number;

    public name: string;

    public fields: ResourceFieldEntity[];
}

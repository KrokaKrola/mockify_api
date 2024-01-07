import type { ResourceEntity } from '../../../domain/project/entities/resource.entity';

class Resource {
    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }

    public name: string;

    public id: number;
}

export class GetResourcesResponse {
    constructor(resources: ResourceEntity[]) {
        this.resources = resources.map((entry) => new Resource(entry.name, entry.id));
    }

    public resources: Resource[];
}

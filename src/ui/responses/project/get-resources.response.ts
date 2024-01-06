import type { ResourceEntity } from '../../../domain/project/entities/resource.entity';

class ProjectEntry {
    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }

    public name: string;

    public id: number;
}

export class GetResourcesResponse {
    constructor(entries: ResourceEntity[]) {
        this.entries = entries.map((entry) => new ProjectEntry(entry.name, entry.id));
    }

    public entries: ProjectEntry[];
}

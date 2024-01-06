import type { ProjectEntryEntity } from '../../../domain/project/entities/project-entry.entity';

class ProjectEntry {
    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }

    public name: string;

    public id: number;
}

export class GetProjectEntriesResponse {
    constructor(entries: ProjectEntryEntity[]) {
        this.entries = entries.map((entry) => new ProjectEntry(entry.name, entry.id));
    }

    public entries: ProjectEntry[];
}

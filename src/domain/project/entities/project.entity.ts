import { ProjectEntryEntity } from './project-entry.entity';

export class ProjectEntity {
    public id: number;

    public name: string;

    public createdAt: Date;

    public updatedAt: Date;

    public deletedAt: Date;

    public userId: number;

    public publicId: string;

    public projectEntries: ProjectEntryEntity[];

    constructor(name: string, userId?: number, id?: number) {
        this.name = name;
        this.userId = userId;
        this.id = id;
    }
}

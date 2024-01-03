import { type Entry } from '@prisma/client';

export class ProjectEntryEntity implements Entry {
    public id: number;

    public name: string;

    public createdAt: Date;

    public updatedAt: Date;

    public deletedAt: Date;

    public projectId: number;

    constructor(id: number, name: string, projectId: number) {
        this.id = id;
        this.name = name;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.projectId = projectId;
    }
}

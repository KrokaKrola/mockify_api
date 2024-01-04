import { type Entry } from '@prisma/client';
import { ProjectEntity } from './project.entity';

export class ProjectEntryEntity implements Entry {
    public id: number;

    public name: string;

    public createdAt: Date;

    public updatedAt: Date;

    public deletedAt: Date;

    public projectId: number;

    public project: ProjectEntity;

    constructor(name: string, projectId: number) {
        this.name = name;
        this.projectId = projectId;
    }
}

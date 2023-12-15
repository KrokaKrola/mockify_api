import { Project } from '@prisma/client';

export class ProjectEntity implements Project {
    public id: number;

    public name: string;

    public createdAt: Date;

    public updatedAt: Date;

    public deletedAt: Date;

    public userId: number;

    constructor(
        id: number,
        name: string,
        userId: number,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date,
    ) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.userId = userId;
    }
}

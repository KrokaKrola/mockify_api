import type { ProjectEntity } from './project.entity';
import type { ResourceFieldEntity } from './resource-field.entity';

export class ResourceEntity {
    public id: number;

    public name: string;

    public createdAt: Date;

    public updatedAt: Date;

    public deletedAt: Date;

    public publicId: string;

    public projectId: number;

    public project: ProjectEntity;

    public fields: ResourceFieldEntity[];

    constructor(name: string, projectId: number, publicId?: string, id?: number) {
        this.name = name;
        this.projectId = projectId;
        this.id = id;
        this.publicId = publicId;
    }
}

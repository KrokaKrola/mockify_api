import type { ProjectEntity } from '../../../domain/project/entities/project.entity';

class ProjectResponse {
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public id: string;

    public name: string;
}

export class GetProjectsResponse {
    public projects: ProjectResponse[];

    constructor(projects: ProjectEntity[]) {
        this.projects = projects.map((project) => {
            return new ProjectResponse(project.publicId, project.name);
        });
    }
}

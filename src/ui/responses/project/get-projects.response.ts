import type { ProjectEntity } from '../../../domain/project/entities/project.entity';

class ProjectResponse {
    constructor(id: number, name: string, projectId: string) {
        this.id = id;
        this.name = name;
        this.projectId = projectId;
    }

    public id: number;

    public name: string;

    public projectId: string;
}

export class GetProjectsResponse {
    public projects: ProjectResponse[];

    constructor(projects: ProjectEntity[]) {
        this.projects = projects.map((project) => {
            return new ProjectResponse(project.id, project.name, project.publicId);
        });
    }
}

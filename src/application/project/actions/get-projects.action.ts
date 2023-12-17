import { Injectable } from '@nestjs/common';
import { GetProjectsResponse } from '../../../ui/responses/project/get-projects.response';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';

@Injectable()
export class GetProjectsAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(userId: number): Promise<GetProjectsResponse> {
        const projects = await this.projectRepository.getUserProjects(userId);

        return new GetProjectsResponse(projects);
    }
}

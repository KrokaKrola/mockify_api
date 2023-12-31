import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../../infra/database/postgres/repositories/project.repository';
import { GetProjectsResponse } from '../../../../ui/responses/project/get-projects.response';

@Injectable()
export class GetProjectsAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(userId: number): Promise<GetProjectsResponse> {
        const projects = await this.projectRepository.findByUserId(userId);

        return new GetProjectsResponse(projects);
    }
}

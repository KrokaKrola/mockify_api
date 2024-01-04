import { Injectable } from '@nestjs/common';
import { GetProjectEntriesResponse } from '../../../ui/responses/project/get-project-entries.response';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';

@Injectable()
export class GetProjectEntriesAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(projectId: number, userId: number): Promise<GetProjectEntriesResponse> {
        // TODO: rewrite with project-entry-repository
        const project = await this.projectRepository.findProjectById(projectId, ['projectEntries']);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        return new GetProjectEntriesResponse(project.projectEntries);
    }
}

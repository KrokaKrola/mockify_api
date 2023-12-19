import { Injectable } from '@nestjs/common';
import { GetProjectEntriesResponse } from '../../../ui/responses/project/get-project-entries.response';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class GetProjectEntriesAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(projectId: number, userId: number): Promise<GetProjectEntriesResponse> {
        const project = await this.projectRepository.findByIdWithEntries(projectId);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        return new GetProjectEntriesResponse(project.entry);
    }
}

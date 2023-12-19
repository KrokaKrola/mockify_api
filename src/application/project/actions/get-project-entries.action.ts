import { Injectable } from '@nestjs/common';
import { ProjectEntryRepository } from '../../../infra/database/repositories/project-entry.repository';
import { GetProjectEntriesResponse } from '../../../ui/responses/project/get-project-entries.response';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class GetProjectEntriesAction {
    constructor(
        private readonly projectEntryRepository: ProjectEntryRepository,
        private readonly projectRepository: ProjectRepository,
    ) {}

    public async execute(projectId: number, userId: number): Promise<GetProjectEntriesResponse> {
        const project = await this.projectRepository.findById(projectId);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        const projectEntries = await this.projectEntryRepository.findProjectEntries(projectId);

        return new GetProjectEntriesResponse(projectEntries);
    }
}

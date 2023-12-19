import { Injectable } from '@nestjs/common';
import { ProjectEntryRepository } from '../../../infra/database/repositories/project-entry.repository';
import { CreateEntryRequest } from '../../../ui/requests/project/create-entry.request';
import { CreateProjectEntryResponse } from '../../../ui/responses/project/create-project-entry.response';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { MaximumResourceNumberException } from '../../../infra/exceptions/maximum-resource-number.exception';

@Injectable()
export class CreateProjectEntryAction {
    constructor(
        private readonly entryRepository: ProjectEntryRepository,
        private readonly projectRepository: ProjectRepository,
    ) {}

    public async execute(
        dto: CreateEntryRequest,
        userId: number,
        projectId: number,
    ): Promise<CreateProjectEntryResponse> {
        const project = await this.projectRepository.findByIdWithEntries(projectId);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.entry.length >= 20) {
            throw new MaximumResourceNumberException('Maximum number of entries reached');
        }

        const entry = project.entry.find((e) => e.name === dto.name);
        if (entry) {
            throw new ResourceExistsException('Entry with this name already exists');
        }

        const createdEntry = await this.entryRepository.create(dto.name, projectId);

        return new CreateProjectEntryResponse(createdEntry.id, createdEntry.name);
    }
}

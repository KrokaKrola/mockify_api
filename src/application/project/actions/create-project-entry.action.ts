import { Injectable } from '@nestjs/common';

import { ProjectEntryEntity } from '../../../domain/project/entities/project-entry.entity';
import { ProjectEntryRepository } from '../../../infra/database/postgres/repositories/project-entry.repository';
import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { MaximumResourceNumberException } from '../../../infra/exceptions/maximum-resource-number.exception';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { CreateProjectEntryResponse } from '../../../ui/responses/project/create-project-entry.response';

import type { CreateEntryRequest } from '../../../ui/requests/project/create-entry.request';

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
        const project = await this.projectRepository.findProjectById(projectId, ['projectEntries']);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.projectEntries.length >= 20) {
            throw new MaximumResourceNumberException('Maximum number of entries reached');
        }

        const entry = project.projectEntries.find((e) => e.name === dto.name);
        if (entry) {
            throw new ResourceExistsException('Entry with this name already exists');
        }

        const newEntry = new ProjectEntryEntity(dto.name, projectId);
        const result = await this.entryRepository.save(newEntry);

        return new CreateProjectEntryResponse(result.id, newEntry.name);
    }
}

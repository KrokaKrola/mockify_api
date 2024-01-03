import { Injectable } from '@nestjs/common';
import { UpdateProjectEntryRequest } from '../../../ui/requests/project/update-project-entry.request';
import { UpdateProjectEntryResponse } from '../../../ui/responses/project/update-project-entry.response';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';
import { ProjectEntryRepository } from '../../../infra/database/repositories/project-entry.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';

@Injectable()
export class UpdateProjectEntryAction {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectEntryRepository: ProjectEntryRepository,
    ) {}

    public async execute(
        dto: UpdateProjectEntryRequest,
        projectId: number,
        entryId: number,
        userId: number,
    ): Promise<UpdateProjectEntryResponse> {
        const project = await this.projectRepository.findByIdWithEntries(projectId);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        const entity = project.entries.find((projEntry) => projEntry.id === entryId);

        if (!entity) {
            throw new ResourceNotFoundException('Entry with this id does not exist');
        }

        const existingEntry = project.entries.find(
            (e) => e.name === dto.name && e.name !== dto.name,
        );

        if (existingEntry) {
            throw new ResourceExistsException('Entry with this name already exists');
        }

        entity.name = dto.name;

        const updatedEntry = await this.projectEntryRepository.update(entity);

        return new UpdateProjectEntryResponse(updatedEntry.id, updatedEntry.name);
    }
}

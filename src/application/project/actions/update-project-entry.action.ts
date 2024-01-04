import { Injectable } from '@nestjs/common';
import { UpdateProjectEntryRequest } from '../../../ui/requests/project/update-project-entry.request';
import { UpdateProjectEntryResponse } from '../../../ui/responses/project/update-project-entry.response';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ProjectEntryRepository } from '../../../infra/database/postgres/repositories/project-entry.repository';

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
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['projectEntries'],
        });

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        const entry = project.projectEntries.find((projEntry) => projEntry.id === entryId);

        if (!entry) {
            throw new ResourceNotFoundException('Entry with this id does not exist');
        }

        const existingEntry = project.projectEntries.find(
            (e) => e.name === dto.name && e.id !== entryId,
        );

        if (existingEntry) {
            throw new ResourceExistsException('Entry with this name already exists');
        }

        entry.name = dto.name;

        await this.projectEntryRepository.update({ id: entryId }, entry);

        return new UpdateProjectEntryResponse(entry.id, entry.name);
    }
}

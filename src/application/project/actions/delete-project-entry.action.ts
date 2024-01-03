import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';
import { ProjectEntryRepository } from '../../../infra/database/repositories/project-entry.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class DeleteProjectEntryAction {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectEntryRepository: ProjectEntryRepository,
    ) {}

    public async execute(projectId: number, entryId: number, userId: number): Promise<void> {
        const project = await this.projectRepository.findByIdWithEntries(projectId);

        if (!project) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project with this id does not exist');
        }

        const entry = project.entries.find((e) => e.id === entryId);

        if (!entry) {
            throw new ResourceNotFoundException('Entry with this id does not exist');
        }

        await this.projectEntryRepository.delete(entryId);

        return;
    }
}

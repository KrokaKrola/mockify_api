import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';

@Injectable()
export class DeleteProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(id: number): Promise<void> {
        const project = await this.projectRepository.findProjectById(id);

        if (!project) {
            throw new ResourceNotFoundException('Project not found');
        }

        await this.projectRepository.delete(id);
    }
}

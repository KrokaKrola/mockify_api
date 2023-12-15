import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';

@Injectable()
export class DeleteProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(id: number): Promise<void> {
        const project = await this.projectRepository.findById(id);

        if (!project) {
            throw new ResourceExistsException('Project not found', 'id');
        }

        await this.projectRepository.delete(id);
    }
}

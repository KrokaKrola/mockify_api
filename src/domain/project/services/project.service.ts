import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

import type { ProjectEntity } from '../entities/project.entity';

@Injectable()
export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async validateAndCheckDeletability(
        projectId: number,
        userId: number,
    ): Promise<ProjectEntity> {
        const project = await this.projectRepository.findById(projectId);

        if (!project) {
            throw new ResourceNotFoundException('Project not found');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project not found');
        }

        return project;
    }
}

import { Injectable } from '@nestjs/common';

import type { FindOneOptions } from 'typeorm';

import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

import type { ProjectEntity } from '../entities/project.entity';

@Injectable()
export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async validateAndCheckExistence(
        projectId: number,
        userId: number,
        projectRelations?: FindOneOptions<ProjectEntity>['relations'],
    ): Promise<ProjectEntity> {
        const project = await this.projectRepository.findById(projectId, projectRelations);

        if (!project) {
            throw new ResourceNotFoundException('Project not found');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project not found');
        }

        return project;
    }
}

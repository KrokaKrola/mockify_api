import { Injectable } from '@nestjs/common';

import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

@Injectable()
export class ProjectOwnershipGuard implements CanActivate {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        const projectId = request.params.id;
        const userId = request.user.id;

        const project = await this.projectRepository.findProjectById(+projectId);

        if (!project) {
            throw new ResourceNotFoundException('Project not found');
        }

        if (project.userId !== userId) {
            throw new ResourceNotFoundException('Project not found');
        }

        return true;
    }
}

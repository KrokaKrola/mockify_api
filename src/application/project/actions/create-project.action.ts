import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';
import { CreateProjectResponse } from '../../../ui/responses/project/create-project.response';
import { CreateProjectRequest } from '../../../ui/requests/project/create-project.request';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { MaximumResourceNumberException } from '../../../infra/exceptions/maximum-resource-number.exception';

@Injectable()
export class CreateProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(
        dto: CreateProjectRequest,
        userId: number,
    ): Promise<CreateProjectResponse> {
        const userProjects = await this.projectRepository.getUserProjects(userId);

        if (userProjects.length >= 5) {
            throw new MaximumResourceNumberException('User already has 3 projects', 'user');
        }

        const project = await this.projectRepository.findByNameAndUserId(dto.name, userId);

        if (project) {
            throw new ResourceExistsException('Project already exists', 'name');
        }

        const createdProject = await this.projectRepository.create(dto.name, userId);

        return new CreateProjectResponse(createdProject.id, createdProject.name);
    }
}

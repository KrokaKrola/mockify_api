import { Injectable } from '@nestjs/common';
import { CreateProjectResponse } from '../../../ui/responses/project/create-project.response';
import { CreateProjectRequest } from '../../../ui/requests/project/create-project.request';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { MaximumResourceNumberException } from '../../../infra/exceptions/maximum-resource-number.exception';
import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ProjectEntity } from '../../../domain/project/entities/project.entity';

@Injectable()
export class CreateProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(
        dto: CreateProjectRequest,
        userId: number,
    ): Promise<CreateProjectResponse> {
        const userProjects = await this.projectRepository.findProjectsByUserId(userId);

        if (userProjects.length >= 5) {
            throw new MaximumResourceNumberException('User already has 5 projects', 'user');
        }

        const project = userProjects.find((proj) => proj.name === dto.name);

        if (project) {
            throw new ResourceExistsException('Project already exists', 'name');
        }

        const createdProject = new ProjectEntity(dto.name, userId);
        const result = await this.projectRepository.save(createdProject);

        return new CreateProjectResponse(result.id, createdProject.name);
    }
}

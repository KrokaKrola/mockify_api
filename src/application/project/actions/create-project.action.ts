import { Injectable } from '@nestjs/common';
import { CreateProjectResponse } from '../../../ui/responses/project/create-project.response';
import { CreateProjectRequest } from '../../../ui/requests/project/create-project.request';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { MaximumResourceNumberException } from '../../../infra/exceptions/maximum-resource-number.exception';
import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';

@Injectable()
export class CreateProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(
        dto: CreateProjectRequest,
        userId: number,
    ): Promise<CreateProjectResponse> {
        const userProjects = await this.projectRepository.find({ where: { userId } });

        if (userProjects.length >= 5) {
            throw new MaximumResourceNumberException('User already has 5 projects', 'user');
        }

        const project = userProjects.find((proj) => proj.name === dto.name);

        if (project) {
            throw new ResourceExistsException('Project already exists', 'name');
        }

        const createdProject = this.projectRepository.create({ name: dto.name, userId });

        await this.projectRepository.save(createdProject);

        return new CreateProjectResponse(createdProject.id, createdProject.name);
    }
}

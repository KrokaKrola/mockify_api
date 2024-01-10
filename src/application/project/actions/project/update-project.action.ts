import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../../infra/database/postgres/repositories/project.repository';
import { UpdateProjectResponse } from '../../../../ui/responses/project/update-project.response';

import type { UpdateProjectRequest } from '../../../../ui/requests/project/update-project.request';

@Injectable()
export class UpdateProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(dto: UpdateProjectRequest, id: number): Promise<UpdateProjectResponse> {
        const project = await this.projectRepository.findById(id);

        await this.projectRepository.update({ id }, { name: dto.name });

        project.name = dto.name;

        return new UpdateProjectResponse(project.id, project.name, project.publicId);
    }
}

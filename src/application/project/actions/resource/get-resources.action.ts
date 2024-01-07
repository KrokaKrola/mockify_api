import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../../infra/database/postgres/repositories/project.repository';
import { GetResourcesResponse } from '../../../../ui/responses/project/get-resources.response';

@Injectable()
export class GetResourcesAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(projectId: number): Promise<GetResourcesResponse> {
        const project = await this.projectRepository.findById(projectId, ['resources']);

        return new GetResourcesResponse(project.resources);
    }
}

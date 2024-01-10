import { Injectable } from '@nestjs/common';

import { ProjectService } from '../../../../domain/project/services/project.service';
import { ProjectRepository } from '../../../../infra/database/postgres/repositories/project.repository';

@Injectable()
export class DeleteProjectAction {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectService: ProjectService,
    ) {}

    public async execute(id: number, userId: number): Promise<void> {
        await this.projectService.validateAndCheckExistence(id, userId);

        await this.projectRepository.delete(id);
    }
}

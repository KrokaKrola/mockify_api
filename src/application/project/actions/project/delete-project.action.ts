import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../../infra/database/postgres/repositories/project.repository';

@Injectable()
export class DeleteProjectAction {
    constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(id: number): Promise<void> {
        await this.projectRepository.delete(id);
    }
}

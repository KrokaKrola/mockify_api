import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { ProjectEntity } from '../../../../domain/project/entities/project.entity';
import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
    constructor(
        @InjectRepository(ProjectMapper)
        repository: Repository<ProjectEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    public async findProjectsByUserId(userId: number): Promise<ProjectEntity[]> {
        return this.find({ where: { userId } });
    }

    public async findProjectById(
        id: number,
        relations?: FindOneOptions<ProjectEntity>['relations'],
    ): Promise<ProjectEntity> {
        return this.findOne({ where: { id }, relations });
    }
}

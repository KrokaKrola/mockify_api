import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import type { FindOneOptions } from 'typeorm';

import { ProjectMapper } from '../mappers/project.mapper';

import type { ProjectEntity } from '../../../../domain/project/entities/project.entity';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
    constructor(
        @InjectRepository(ProjectMapper)
        repository: Repository<ProjectEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    public async findByUserId(userId: number): Promise<ProjectEntity[]> {
        return this.find({ where: { userId } });
    }

    public async findById(
        id: number,
        relations?: FindOneOptions<ProjectEntity>['relations'],
    ): Promise<ProjectEntity> {
        return this.findOne({ where: { id }, relations });
    }

    public async findByPublicId(
        publicId: string,
        relations?: FindOneOptions<ProjectEntity>['relations'],
    ): Promise<ProjectEntity> {
        return this.findOne({ where: { publicId }, relations });
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import type { FindOneOptions } from 'typeorm';

import { ResourceMapper } from '../mappers/resource.mapper';

import type { ResourceEntity } from '../../../../domain/project/entities/resource.entity';

@Injectable()
export class ResourceRepository extends Repository<ResourceEntity> {
    constructor(
        @InjectRepository(ResourceMapper)
        repository: Repository<ResourceEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    public async findById(
        id: number,
        relations?: FindOneOptions<ResourceEntity>['relations'],
    ): Promise<ResourceEntity> {
        return this.findOne({ where: { id }, relations });
    }

    public async findByPublicId(
        publicId: string,
        relations?: FindOneOptions<ResourceEntity>['relations'],
    ): Promise<ResourceEntity> {
        return this.findOne({ where: { publicId }, relations });
    }

    public async findByName(name: string): Promise<ResourceEntity> {
        return this.findOne({ where: { name } });
    }

    public async findByProjectId(
        projectId: number,
        relations?: FindOneOptions<ResourceEntity>['relations'],
    ): Promise<ResourceEntity[]> {
        return this.find({ where: { projectId }, relations });
    }
}

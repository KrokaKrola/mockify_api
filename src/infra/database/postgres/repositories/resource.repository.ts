import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

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

    public async findProjectResources(projectId: number): Promise<ResourceEntity[]> {
        return this.find({ where: { projectId } });
    }

    public async findResourceById(id: number): Promise<ResourceEntity> {
        return this.findOne({ where: { id } });
    }

    public async findResourceByName(name: string): Promise<ResourceEntity> {
        return this.findOne({ where: { name } });
    }
}

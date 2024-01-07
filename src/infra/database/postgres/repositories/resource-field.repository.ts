import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ResourceMapper } from '../mappers/resource.mapper';

import type { ResourceFieldEntity } from '../../../../domain/project/entities/resource-field.entity';

@Injectable()
export class ResourceFieldRepository extends Repository<ResourceFieldEntity> {
    constructor(
        @InjectRepository(ResourceMapper)
        repository: Repository<ResourceFieldEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    public async findByName(name: string): Promise<ResourceFieldEntity> {
        return this.findOne({ where: { name } });
    }

    public async findByResourceId(resourceId: number): Promise<ResourceFieldEntity[]> {
        return this.find({ where: { resourceId } });
    }
}

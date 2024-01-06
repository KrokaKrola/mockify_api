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
}

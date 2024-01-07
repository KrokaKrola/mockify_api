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
}

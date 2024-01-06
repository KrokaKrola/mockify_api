import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProjectEntryMapper } from '../mappers/project-entry.mapper';

import type { ProjectEntryEntity } from '../../../../domain/project/entities/project-entry.entity';

@Injectable()
export class ProjectEntryRepository extends Repository<ProjectEntryEntity> {
    constructor(
        @InjectRepository(ProjectEntryMapper)
        repository: Repository<ProjectEntryEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}

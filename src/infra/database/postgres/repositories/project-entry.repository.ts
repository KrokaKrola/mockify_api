import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntryEntity } from '../../../../domain/project/entities/project-entry.entity';
import { ProjectEntryMapper } from '../mappers/project-entry.mapper';

@Injectable()
export class ProjectEntryRepository extends Repository<ProjectEntryEntity> {
    constructor(
        @InjectRepository(ProjectEntryMapper)
        repository: Repository<ProjectEntryEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}

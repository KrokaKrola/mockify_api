import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMapper } from '../mappers/project.mapper';
import { ProjectEntity } from '../../../../domain/project/entities/project.entity';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
    constructor(
        @InjectRepository(ProjectMapper)
        repository: Repository<ProjectEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}

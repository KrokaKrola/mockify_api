import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { UserEntity } from '../../../../domain/user/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectRepository(UserMapper)
        repository: Repository<UserEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}

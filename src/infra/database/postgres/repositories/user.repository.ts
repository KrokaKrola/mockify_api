import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../../../domain/user/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectRepository(UserMapper)
        repository: Repository<UserEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    public async existsByEmail(email: string): Promise<boolean> {
        return this.exists({ where: { email } });
    }

    public async findOneByEmail(email: string): Promise<UserEntity> {
        return this.findOne({ where: { email } });
    }

    public async findById(id: number): Promise<UserEntity> {
        return this.findOne({ where: { id } });
    }
}

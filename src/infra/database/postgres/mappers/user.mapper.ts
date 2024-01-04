import { EntitySchema } from 'typeorm';

import { ProjectEntity } from '../../../../domain/project/entities/project.entity';
import { UserEntity } from '../../../../domain/user/entities/user.entity';

export const UserMapper = new EntitySchema<UserEntity>({
    name: UserEntity.name,
    tableName: 'users',
    target: UserEntity,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        email: {
            name: 'email',
            type: String,
            nullable: false,
        },
        name: {
            name: 'name',
            type: String,
            nullable: true,
        },
        password: {
            name: 'password',
            type: String,
            nullable: false,
        },
        refreshToken: {
            name: 'refresh_token',
            type: String,
            nullable: true,
        },
        createdAt: {
            name: 'created_at',
            type: 'timestamp with time zone',
            createDate: true,
        },
        updatedAt: {
            name: 'updated_at',
            type: 'timestamp with time zone',
            updateDate: true,
        },
        deletedAt: {
            name: 'deleted_at',
            type: 'timestamp with time zone',
            deleteDate: true,
        },
    },
    orderBy: {
        id: 'ASC',
    },
    relations: {
        projects: {
            type: 'one-to-many',
            target: ProjectEntity.name,
            inverseSide: 'user',
        },
    },
});

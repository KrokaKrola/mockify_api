import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserEntity } from '../../../domain/user/entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    public async findById(id: number): Promise<UserEntity> {
        return this.prisma.user.findFirst({
            where: {
                id,
            },
        });
    }

    public async findByEmail(email: string): Promise<UserEntity> {
        return this.prisma.user.findFirst({
            where: {
                email,
            },
        });
    }

    public async create(user: UserEntity): Promise<UserEntity> {
        return this.prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: user.password,
            },
        });
    }

    public async update(user: Partial<Omit<UserEntity, 'projects'>>): Promise<UserEntity> {
        return this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: user,
        });
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ProjectEntity } from '../../../domain/project/entities/project.entity';

@Injectable()
export class ProjectRepository {
    constructor(private readonly prisma: PrismaService) {}

    public async findByNameAndUserId(name: string, userId: number): Promise<ProjectEntity> {
        return this.prisma.project.findFirst({
            where: {
                name,
                userId,
            },
        });
    }

    public async create(name: string, userId: number): Promise<ProjectEntity> {
        return this.prisma.project.create({
            data: {
                name,
                userId,
            },
        });
    }
}

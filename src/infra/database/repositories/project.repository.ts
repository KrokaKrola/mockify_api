import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ProjectEntity } from '../../../domain/project/entities/project.entity';

@Injectable()
export class ProjectRepository {
    constructor(private readonly prisma: PrismaService) {}

    public async getUserProjects(userId: number): Promise<ProjectEntity[]> {
        return this.prisma.project.findMany({
            where: {
                userId,
            },
        });
    }

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

    public async findById(id: number): Promise<ProjectEntity> {
        return this.prisma.project.findUnique({
            where: {
                id,
            },
        });
    }

    public async update(project: ProjectEntity): Promise<ProjectEntity> {
        return this.prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                name: project.name,
            },
        });
    }

    public async delete(id: number): Promise<void> {
        await this.prisma.project.delete({
            where: {
                id,
            },
        });
    }

    public async getProjectBuUuid(uuid: string): Promise<ProjectEntity> {
        return this.prisma.project.findUnique({
            where: {
                projectId: uuid,
            },
        });
    }
}

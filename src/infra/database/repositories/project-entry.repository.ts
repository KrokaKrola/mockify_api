import { PrismaService } from 'nestjs-prisma';
import { ProjectEntryEntity } from '../../../domain/project/entities/project-entry.entity';

export class ProjectEntryRepository {
    constructor(private readonly prisma: PrismaService) {}

    public async create(name: string, projectId: number): Promise<ProjectEntryEntity> {
        return this.prisma.entry.create({
            data: {
                name,
                projectId,
            },
        });
    }

    public async findById(id: number): Promise<ProjectEntryEntity> {
        return this.prisma.entry.findUnique({
            where: {
                id,
            },
        });
    }

    public async update(entry: ProjectEntryEntity): Promise<ProjectEntryEntity> {
        return this.prisma.entry.update({
            where: {
                id: entry.id,
            },
            data: {
                name: entry.name,
            },
        });
    }

    public async delete(id: number): Promise<void> {
        await this.prisma.entry.delete({
            where: {
                id,
            },
        });
    }
}

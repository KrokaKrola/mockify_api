import { Controller, Get, NotFoundException, Req } from '@nestjs/common';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { Request } from 'express';

@Controller('api')
export class UserApiController {
    constructor(private readonly projectRepository: ProjectRepository) {}

    @Get('/')
    public async getHello(@Req() req: Request): Promise<string> {
        const match = req.hostname.match(/^([^.]+)/);

        const subdomain = match && match[1];

        const project = await this.projectRepository.getProjectBuUuid(
            subdomain === '49ac-88-196-191-247'
                ? '3e396237-b25b-45ad-8650-c0b91a2f13e0'
                : subdomain,
        );

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return 'Hello World!';
    }
}

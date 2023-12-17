import { ProjectsController } from '../projects.controller';
import { Test } from '@nestjs/testing';
import { ProjectRepository } from '../../../infra/database/repositories/project.repository';
import { CreateProjectAction } from '../../../application/project/actions/create-project.action';
import { UpdateProjectAction } from '../../../application/project/actions/update-project.action';
import { DeleteProjectAction } from '../../../application/project/actions/delete-project.action';
import { GetProjectsAction } from '../../../application/project/actions/get-projects.action';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { ProjectEntity } from '../../../domain/project/entities/project.entity';
import { Request } from 'express';

describe('ProjectsController', () => {
    let controller: ProjectsController;
    let prismaService: PrismaService;
    let projectsRepository: ProjectRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ProjectsController],
            providers: [
                ProjectRepository,
                CreateProjectAction,
                UpdateProjectAction,
                DeleteProjectAction,
                GetProjectsAction,
                PrismaService,
                ConfigService,
            ],
        }).compile();

        controller = moduleRef.get<ProjectsController>(ProjectsController);
        prismaService = moduleRef.get<PrismaService>(PrismaService);
        projectsRepository = moduleRef.get<ProjectRepository>(ProjectRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        prismaService.$disconnect();
    });

    describe('getProjects', () => {
        it('should return projects', async () => {
            jest.spyOn(projectsRepository, 'getUserProjects').mockImplementation(() => {
                return Promise.resolve([
                    new ProjectEntity(1, 'Project 1', 1, new Date(), new Date(), new Date()),
                    new ProjectEntity(2, 'Project 2', 1, new Date(), new Date(), new Date()),
                ]);
            });

            const response = await controller.getProjects({ user: { id: 1 } } as Request);

            expect(response).toEqual({
                projects: [
                    { id: 1, name: 'Project 1' },
                    { id: 2, name: 'Project 2' },
                ],
            });
        });
    });
});

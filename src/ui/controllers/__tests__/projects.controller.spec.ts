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
import { CreateProjectRequest } from '../../requests/project/create-project.request';
import { CreateProjectResponse } from '../../responses/project/create-project.response';
import { MaximumResourceNumberException } from '../../../infra/exceptions/maximum-resource-number.exception';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';

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

    describe('create', () => {
        it('should create a project', async () => {
            jest.spyOn(projectsRepository, 'getUserProjects').mockImplementation(() => {
                return Promise.resolve([
                    new ProjectEntity(1, 'Project 1', 1, new Date(), new Date()),
                    new ProjectEntity(2, 'Project 2', 1, new Date(), new Date()),
                ]);
            });

            const newProject = new ProjectEntity(3, 'Project 3', 1, new Date(), new Date());

            jest.spyOn(projectsRepository, 'create').mockImplementation(() => {
                return Promise.resolve(newProject);
            });

            const dto = new CreateProjectRequest(newProject.name);

            const response = await controller.create(dto, {
                user: { id: 1 },
            } as Request);

            const newProjectResponse = new CreateProjectResponse(newProject.id, newProject.name);

            expect(response).toEqual(newProjectResponse);
        });

        it('should throw an error if user already has 5 projects', async () => {
            jest.spyOn(projectsRepository, 'getUserProjects').mockImplementation(() => {
                return Promise.resolve([
                    new ProjectEntity(1, 'Project 1', 1, new Date(), new Date()),
                    new ProjectEntity(2, 'Project 2', 1, new Date(), new Date()),
                    new ProjectEntity(3, 'Project 3', 1, new Date(), new Date()),
                    new ProjectEntity(4, 'Project 4', 1, new Date(), new Date()),
                    new ProjectEntity(5, 'Project 5', 1, new Date(), new Date()),
                ]);
            });

            const newProject = new ProjectEntity(6, 'Project 6', 1, new Date(), new Date());

            jest.spyOn(projectsRepository, 'create').mockImplementation(() => {
                return Promise.resolve(newProject);
            });

            const dto = new CreateProjectRequest(newProject.name);

            try {
                await controller.create(dto, {
                    user: { id: 1 },
                } as Request);
            } catch (error) {
                expect(error.status).toEqual(409);
                expect(error.message).toEqual('User already has 5 projects');
                expect(error).toBeInstanceOf(MaximumResourceNumberException);
            }
        });

        it('should throw an error if project already exists', async () => {
            jest.spyOn(projectsRepository, 'getUserProjects').mockImplementation(() => {
                return Promise.resolve([
                    new ProjectEntity(1, 'Project 1', 1, new Date(), new Date()),
                    new ProjectEntity(2, 'Project 2', 1, new Date(), new Date()),
                ]);
            });

            const newProject = new ProjectEntity(3, 'Project 1', 1, new Date(), new Date());

            jest.spyOn(projectsRepository, 'create').mockImplementation(() => {
                return Promise.resolve(newProject);
            });

            const dto = new CreateProjectRequest(newProject.name);

            try {
                await controller.create(dto, {
                    user: { id: 1 },
                } as Request);
            } catch (error) {
                expect(error.status).toEqual(409);
                expect(error.message).toEqual('Project already exists');
                expect(error).toBeInstanceOf(ResourceExistsException);
            }
        });
    });

    describe('update', () => {
        it('should update a project', async () => {
            const project = new ProjectEntity(1, 'Project 1', 1, new Date(), new Date());

            jest.spyOn(projectsRepository, 'findById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const updatedProject = new ProjectEntity(1, 'Project 1', 1, new Date(), new Date());

            jest.spyOn(projectsRepository, 'update').mockImplementation(() => {
                return Promise.resolve(updatedProject);
            });

            const dto = { name: updatedProject.name };

            const response = await controller.update(dto, 1);

            expect(response).toEqual({
                id: updatedProject.id,
                name: updatedProject.name,
            });
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findById').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            const dto = { name: 'Project 1' };

            try {
                await controller.update(dto, 1);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project not found');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });
    });

    describe('delete', () => {
        it('should delete a project', async () => {
            const project = new ProjectEntity(1, 'Project 1', 1, new Date(), new Date());

            jest.spyOn(projectsRepository, 'findById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            jest.spyOn(projectsRepository, 'delete').mockImplementation(() => {
                return Promise.resolve();
            });

            await controller.delete(1);

            expect(projectsRepository.delete).toHaveBeenCalledWith(project.id);
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findById').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            try {
                await controller.delete(1);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project not found');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });
    });
});

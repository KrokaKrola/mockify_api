import { ProjectsController } from '../projects.controller';
import { Test } from '@nestjs/testing';
import { CreateProjectAction } from '../../../application/project/actions/create-project.action';
import { UpdateProjectAction } from '../../../application/project/actions/update-project.action';
import { DeleteProjectAction } from '../../../application/project/actions/delete-project.action';
import { GetProjectsAction } from '../../../application/project/actions/get-projects.action';
import { ConfigService } from '@nestjs/config';
import { ProjectEntity } from '../../../domain/project/entities/project.entity';
import { Request } from 'express';
import { CreateProjectRequest } from '../../requests/project/create-project.request';
import { CreateProjectResponse } from '../../responses/project/create-project.response';
import { MaximumResourceNumberException } from '../../../infra/exceptions/maximum-resource-number.exception';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { CreateProjectEntryAction } from '../../../application/project/actions/create-project-entry.action';
import { GetProjectEntriesAction } from '../../../application/project/actions/get-project-entries.action';
import { UpdateProjectEntryAction } from '../../../application/project/actions/update-project-entry.action';
import { DeleteProjectEntryAction } from '../../../application/project/actions/delete-project-entry.action';
import { ProjectEntryEntity } from '../../../domain/project/entities/project-entry.entity';
import { CreateProjectEntryResponse } from '../../responses/project/create-project-entry.response';
import { AppConfigModule } from '../../../infra/ioc/app-config/app-config.module';
import { PostgresModule } from '../../../infra/database/postgres/postgres.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ProjectEntryRepository } from '../../../infra/database/postgres/repositories/project-entry.repository';
import { CreateEntryRequest } from '../../requests/project/create-entry.request';
import { UpdateProjectEntryRequest } from '../../requests/project/update-project-entry.request';
import { UpdateProjectRequest } from '../../requests/project/update-project.request';

describe('ProjectsController', () => {
    let controller: ProjectsController;
    let projectsRepository: ProjectRepository;
    let projectEntryRepository: ProjectEntryRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                AppConfigModule,
                PostgresModule,
                TypeOrmModule.forFeature([ProjectEntity, ProjectEntryEntity]),
            ],
            controllers: [ProjectsController],
            providers: [
                ProjectRepository,
                ProjectEntryRepository,
                CreateProjectAction,
                UpdateProjectAction,
                DeleteProjectAction,
                GetProjectsAction,
                CreateProjectEntryAction,
                GetProjectEntriesAction,
                UpdateProjectEntryAction,
                DeleteProjectEntryAction,
                ConfigService,
            ],
        }).compile();

        controller = moduleRef.get<ProjectsController>(ProjectsController);
        projectsRepository = moduleRef.get<ProjectRepository>(ProjectRepository);
        projectEntryRepository = moduleRef.get<ProjectEntryRepository>(ProjectEntryRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getProjects', () => {
        it('should return projects', async () => {
            jest.spyOn(projectsRepository, 'findProjectsByUserId').mockImplementation(() => {
                const proj1 = new ProjectEntity('Project 1', 1, 1);
                const proj2 = new ProjectEntity('Project 2', 1, 2);

                return Promise.resolve([proj1, proj2]);
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
            jest.spyOn(projectsRepository, 'findProjectsByUserId').mockImplementation(() => {
                const proj1 = new ProjectEntity('Project 1', 1, 1);
                const proj2 = new ProjectEntity('Project 2', 1, 2);

                return Promise.resolve([proj1, proj2]);
            });

            const newProject = new ProjectEntity('Project 3', null, 3);

            jest.spyOn(projectsRepository, 'save').mockImplementation(() => {
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
            jest.spyOn(projectsRepository, 'findProjectsByUserId').mockImplementation(() => {
                return Promise.resolve(
                    Array(5)
                        .fill(undefined)
                        .map((_, i) => {
                            return new ProjectEntity(`Project ${i + 1}`, 1, i + 1);
                        }),
                );
            });

            const newProject = new ProjectEntity('Project 6', null, 6);
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
            jest.spyOn(projectsRepository, 'findProjectsByUserId').mockImplementation(() => {
                return Promise.resolve([
                    new ProjectEntity('Project 1', null, 1),
                    new ProjectEntity('Project 2', null, 2),
                ]);
            });

            const newProject = new ProjectEntity('Project 1');
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
            const project = new ProjectEntity('Project 1', 1, 1);

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const updatedProject = new ProjectEntity('Project 2');

            jest.spyOn(projectsRepository, 'update').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            const dto = new UpdateProjectRequest(updatedProject.name);
            const response = await controller.update(dto, 1);

            expect(response).toEqual({
                id: project.id,
                name: updatedProject.name,
            });
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            const dto = new UpdateProjectRequest('Project 1');

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
            const project = new ProjectEntity('Project 1', 1, 1);

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            jest.spyOn(projectsRepository, 'delete').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            await controller.delete(1);

            expect(projectsRepository.delete).toHaveBeenCalledWith(project.id);
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(null);
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

    describe('createEntry', () => {
        it('should create an entry', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);

            const newEntry = new ProjectEntryEntity('Entry 2', project.id);

            project.projectEntries = [];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            jest.spyOn(projectEntryRepository, 'save').mockImplementation(() => {
                return Promise.resolve(newEntry);
            });

            const dto = new CreateProjectRequest(newEntry.name);

            const response = await controller.createEntry(dto, 1, {
                user: { id: project.userId },
            } as Request);

            expect(response).toEqual(new CreateProjectEntryResponse(newEntry.id, newEntry.name));
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(null);
            });

            const dto = new CreateEntryRequest('Entry 1');

            try {
                await controller.createEntry(dto, 1, { user: { id: 1 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if user does not own the project', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const dto = { name: 'Entry 1' };

            try {
                await controller.createEntry(dto, 1, { user: { id: 2 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if project already has 20 entries', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);

            project.projectEntries = new Array(20).map((_, i) => {
                return new ProjectEntryEntity(`Entry ${i + 1}`, project.id, i + 1);
            });

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const dto = new CreateEntryRequest('Entry 21');

            try {
                await controller.createEntry(dto, 1, { user: { id: project.userId } } as Request);
            } catch (error) {
                expect(error.status).toEqual(409);
                expect(error.message).toEqual('Maximum number of entries reached');
                expect(error).toBeInstanceOf(MaximumResourceNumberException);
            }
        });

        it('should throw an error if entry already exists', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const entry = new ProjectEntryEntity('Entry 1', project.id, 1);

            project.projectEntries = [entry];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const dto = new CreateEntryRequest('Entry 1');

            try {
                await controller.createEntry(dto, 1, { user: { id: project.userId } } as Request);
            } catch (error) {
                expect(error.status).toEqual(409);
                expect(error.message).toEqual('Entry with this name already exists');
                expect(error).toBeInstanceOf(ResourceExistsException);
            }
        });
    });

    describe('getEntries', () => {
        it('should return entries', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const entry = new ProjectEntryEntity('Entry 1', project.id, 1);

            project.projectEntries = [entry];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const response = await controller.getEntries(1, {
                user: { id: project.userId },
            } as Request);

            expect(response).toEqual({
                entries: [{ id: entry.id, name: entry.name }],
            });
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(null);
            });

            try {
                await controller.getEntries(1, { user: { id: 1 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if user does not own the project', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            try {
                await controller.getEntries(1, { user: { id: 2 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });
    });

    describe('updateEntry', () => {
        it('should update an entry', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const entry = new ProjectEntryEntity('Entry 1', project.id, 1);

            project.projectEntries = [entry];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const updatedEntry = new ProjectEntryEntity('Entry update', project.id, entry.id);

            jest.spyOn(projectEntryRepository, 'update').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            const dto = new UpdateProjectEntryRequest(updatedEntry.name);

            const response = await controller.updateEntry(dto, 1, 1, {
                user: { id: project.userId },
            } as Request);

            expect(response).toEqual({
                id: entry.id,
                name: updatedEntry.name,
            });
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(null);
            });

            const dto = new UpdateProjectEntryRequest('Project 1');

            try {
                await controller.updateEntry(dto, 1, 1, { user: { id: 1 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if user does not own the project', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            jest.spyOn(projectEntryRepository, 'update').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            const dto = new UpdateProjectEntryRequest('Project 1');

            try {
                await controller.updateEntry(dto, 1, 1, {
                    user: { id: 2 },
                } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if entry does not exist', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const entry = new ProjectEntryEntity('Entry 1', project.id, 1);

            project.projectEntries = [entry];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const dto = new UpdateProjectEntryRequest('Entry 2');

            try {
                await controller.updateEntry(dto, 1, 2, { user: { id: 1 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Entry with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if entry already exists', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const entry1 = new ProjectEntryEntity('Entry 1', project.id, 1);
            const entry2 = new ProjectEntryEntity('Entry 2', project.id, 2);

            project.projectEntries = [entry1, entry2];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const updatedEntry = new ProjectEntryEntity('Entry 2', project.id);
            const dto = new UpdateProjectEntryRequest(updatedEntry.name);

            try {
                await controller.updateEntry(dto, project.id, 1, {
                    user: { id: project.userId },
                } as Request);
            } catch (error) {
                expect(error.status).toEqual(409);
                expect(error.message).toEqual('Entry with this name already exists');
                expect(error).toBeInstanceOf(ResourceExistsException);
            }
        });
    });

    describe('deleteEntry', () => {
        it('should delete an entry', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const entry = new ProjectEntryEntity('Entry 1', project.id, 1);

            project.projectEntries = [entry];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            jest.spyOn(projectEntryRepository, 'delete').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            await controller.deleteEntry(1, 1, { user: { id: project.userId } } as Request);

            expect(projectEntryRepository.delete).toHaveBeenCalledWith(entry.id);
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(null);
            });

            try {
                await controller.deleteEntry(1, 1, { user: { id: 1 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if user does not own the project', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            jest.spyOn(projectEntryRepository, 'delete').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            try {
                await controller.deleteEntry(1, 1, { user: { id: 2 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });
    });
});

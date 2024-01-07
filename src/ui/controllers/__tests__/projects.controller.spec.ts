import * as crypto from 'node:crypto';

import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import type { Request } from 'express';

import { CreateProjectAction } from '../../../application/project/actions/create-project.action';
import { CreateResourceAction } from '../../../application/project/actions/create-resource.action';
import { DeleteProjectAction } from '../../../application/project/actions/delete-project.action';
import { DeleteResourceAction } from '../../../application/project/actions/delete-resource.action';
import { GetProjectsAction } from '../../../application/project/actions/get-projects.action';
import { GetResourcesAction } from '../../../application/project/actions/get-resources.action';
import { UpdateProjectAction } from '../../../application/project/actions/update-project.action';
import { UpdateResourceAction } from '../../../application/project/actions/update-resource.action';
import { ProjectEntity } from '../../../domain/project/entities/project.entity';
import { ResourceEntity } from '../../../domain/project/entities/resource.entity';
import { PostgresModule } from '../../../infra/database/postgres/postgres.module';
import { ProjectRepository } from '../../../infra/database/postgres/repositories/project.repository';
import { ResourceRepository } from '../../../infra/database/postgres/repositories/resource.repository';
import { MaximumResourceNumberException } from '../../../infra/exceptions/maximum-resource-number.exception';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';
import { ResourceNotFoundException } from '../../../infra/exceptions/resource-not-found.exception';
import { AppConfigModule } from '../../../infra/ioc/app-config/app-config.module';
import { CreateProjectRequest } from '../../requests/project/create-project.request';
import { CreateResourceRequest } from '../../requests/project/create-resource.request';
import { UpdateProjectRequest } from '../../requests/project/update-project.request';
import { UpdateResourceRequest } from '../../requests/project/update-resource.request';
import { CreateProjectResponse } from '../../responses/project/create-project.response';
import { CreateResourceResponse } from '../../responses/project/create-resource.response';
import { UpdateProjectResponse } from '../../responses/project/update-project.response';
import { ProjectsController } from '../projects.controller';

describe('ProjectsController', () => {
    let controller: ProjectsController;
    let projectsRepository: ProjectRepository;
    let resourceRepository: ResourceRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                AppConfigModule,
                PostgresModule,
                TypeOrmModule.forFeature([ProjectEntity, ResourceEntity]),
            ],
            controllers: [ProjectsController],
            providers: [
                ProjectRepository,
                ResourceRepository,
                CreateProjectAction,
                UpdateProjectAction,
                DeleteProjectAction,
                GetProjectsAction,
                CreateResourceAction,
                GetResourcesAction,
                UpdateResourceAction,
                DeleteResourceAction,
                ConfigService,
            ],
        }).compile();

        controller = moduleRef.get<ProjectsController>(ProjectsController);
        projectsRepository = moduleRef.get<ProjectRepository>(ProjectRepository);
        resourceRepository = moduleRef.get<ResourceRepository>(ResourceRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getProjects', () => {
        it('should return projects', async () => {
            const uuid1 = crypto.randomUUID();
            const uuid2 = crypto.randomUUID();
            jest.spyOn(projectsRepository, 'findProjectsByUserId').mockImplementation(() => {
                const proj1 = new ProjectEntity('Project 1', 1, 1);
                const proj2 = new ProjectEntity('Project 2', 1, 2);

                proj1.publicId = uuid1;
                proj2.publicId = uuid2;

                return Promise.resolve([proj1, proj2]);
            });

            const response = await controller.getProjects({ user: { id: 1 } } as Request);

            expect(response).toEqual({
                projects: [
                    { id: uuid1, name: 'Project 1' },
                    { id: uuid2, name: 'Project 2' },
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
            newProject.publicId = crypto.randomUUID();

            jest.spyOn(projectsRepository, 'save').mockImplementation(() => {
                return Promise.resolve(newProject);
            });

            const dto = new CreateProjectRequest(newProject.name);

            const response = await controller.create(dto, {
                user: { id: 1 },
            } as Request);

            const newProjectResponse = new CreateProjectResponse(
                newProject.publicId,
                newProject.name,
            );

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
            project.publicId = crypto.randomUUID();

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const updatedProject = new ProjectEntity('Project 2');

            jest.spyOn(projectsRepository, 'update').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            const dto = new UpdateProjectRequest(updatedProject.name);
            const response = await controller.update(dto, 1);

            expect(response).toEqual(
                new UpdateProjectResponse(project.publicId, updatedProject.name),
            );
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

    describe('createResource', () => {
        it('should create an resource', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);

            const newResource = new ResourceEntity('Resource 2', project.id);

            project.resources = [];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            jest.spyOn(resourceRepository, 'save').mockImplementation(() => {
                return Promise.resolve(newResource);
            });

            const dto = new CreateResourceRequest(newResource.name);

            const response = await controller.createResource(dto, 1, {
                user: { id: project.userId },
            } as Request);

            expect(response).toEqual(new CreateResourceResponse(newResource.id, newResource.name));
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(null);
            });

            const dto = new CreateResourceRequest('Resource 1');

            try {
                await controller.createResource(dto, 1, { user: { id: 1 } } as Request);
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

            const dto = { name: 'Resource 1' };

            try {
                await controller.createResource(dto, 1, { user: { id: 2 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if project already has 20 resources', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);

            project.resources = new Array(20).map((_, i) => {
                return new ResourceEntity(`Resource ${i + 1}`, project.id, i + 1);
            });

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const dto = new CreateResourceRequest('Resource 21');

            try {
                await controller.createResource(dto, 1, {
                    user: { id: project.userId },
                } as Request);
            } catch (error) {
                expect(error.status).toEqual(409);
                expect(error.message).toEqual('Maximum number of resources reached');
                expect(error).toBeInstanceOf(MaximumResourceNumberException);
            }
        });

        it('should throw an error if resource already exists', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const resource = new ResourceEntity('Resource 1', project.id, 1);

            project.resources = [resource];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const dto = new CreateResourceRequest('Resource 1');

            try {
                await controller.createResource(dto, 1, {
                    user: { id: project.userId },
                } as Request);
            } catch (error) {
                expect(error.status).toEqual(409);
                expect(error.message).toEqual('Resource with this name already exists');
                expect(error).toBeInstanceOf(ResourceExistsException);
            }
        });
    });

    describe('getResources', () => {
        it('should return resources', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const resource = new ResourceEntity('Resource 1', project.id, 1);

            project.resources = [resource];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const response = await controller.getResources(1, {
                user: { id: project.userId },
            } as Request);

            expect(response).toEqual({
                resources: [{ id: resource.id, name: resource.name }],
            });
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(null);
            });

            try {
                await controller.getResources(1, { user: { id: 1 } } as Request);
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
                await controller.getResources(1, { user: { id: 2 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });
    });

    describe('updateResource', () => {
        it('should update an resource', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const resource = new ResourceEntity('Resource 1', project.id, 1);

            project.resources = [resource];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const updatedResource = new ResourceEntity('Resource update', project.id, resource.id);

            jest.spyOn(resourceRepository, 'update').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            const dto = new UpdateResourceRequest(updatedResource.name);

            const response = await controller.updateResource(dto, 1, 1, {
                user: { id: project.userId },
            } as Request);

            expect(response).toEqual({
                id: resource.id,
                name: updatedResource.name,
            });
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(null);
            });

            const dto = new UpdateResourceRequest('Project 1');

            try {
                await controller.updateResource(dto, 1, 1, { user: { id: 1 } } as Request);
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

            jest.spyOn(resourceRepository, 'update').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            const dto = new UpdateResourceRequest('Project 1');

            try {
                await controller.updateResource(dto, 1, 1, {
                    user: { id: 2 },
                } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if resource does not exist', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const resource = new ResourceEntity('Resource 1', project.id, 1);

            project.resources = [resource];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const dto = new UpdateResourceRequest('Resource 2');

            try {
                await controller.updateResource(dto, 1, 2, { user: { id: 1 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Resource with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });

        it('should throw an error if resource already exists', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const resource1 = new ResourceEntity('Resource 1', project.id, 1);
            const resource2 = new ResourceEntity('Resource 2', project.id, 2);

            project.resources = [resource1, resource2];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            const updatedResource = new ResourceEntity('Resource 2', project.id);
            const dto = new UpdateResourceRequest(updatedResource.name);

            try {
                await controller.updateResource(dto, project.id, 1, {
                    user: { id: project.userId },
                } as Request);
            } catch (error) {
                expect(error.status).toEqual(409);
                expect(error.message).toEqual('Resource with this name already exists');
                expect(error).toBeInstanceOf(ResourceExistsException);
            }
        });
    });

    describe('deleteResource', () => {
        it('should delete an resource', async () => {
            const project = new ProjectEntity('Project 1', 1, 1);
            const resource = new ResourceEntity('Resource 1', project.id, 1);

            project.resources = [resource];

            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(project);
            });

            jest.spyOn(resourceRepository, 'delete').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            await controller.deleteResource(1, 1, { user: { id: project.userId } } as Request);

            expect(resourceRepository.delete).toHaveBeenCalledWith(resource.id);
        });

        it('should throw an error if project does not exist', async () => {
            jest.spyOn(projectsRepository, 'findProjectById').mockImplementation(() => {
                return Promise.resolve(null);
            });

            try {
                await controller.deleteResource(1, 1, { user: { id: 1 } } as Request);
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

            jest.spyOn(resourceRepository, 'delete').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            try {
                await controller.deleteResource(1, 1, { user: { id: 2 } } as Request);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('Project with this id does not exist');
                expect(error).toBeInstanceOf(ResourceNotFoundException);
            }
        });
    });
});

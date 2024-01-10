import { Injectable } from '@nestjs/common';

import { ResourceFieldEntity } from '../../../../domain/project/entities/resource-field.entity';
import { ResourceEntity } from '../../../../domain/project/entities/resource.entity';
import { FieldTypeEnum } from '../../../../domain/project/enums/field-type.enum';
import { ProjectService } from '../../../../domain/project/services/project.service';
import { ResourceRepository } from '../../../../infra/database/postgres/repositories/resource.repository';
import { MaximumResourceNumberException } from '../../../../infra/exceptions/maximum-resource-number.exception';
import { ResourceExistsException } from '../../../../infra/exceptions/resource-exists.exception';
import { CreateResourceResponse } from '../../../../ui/responses/project/create-resource.response';

import type { CreateResourceRequest } from '../../../../ui/requests/project/create-resource.request';

@Injectable()
export class CreateResourceAction {
    constructor(
        private readonly resourceRepository: ResourceRepository,
        private readonly projectService: ProjectService,
    ) {}

    public async execute(
        dto: CreateResourceRequest,
        projectId: number,
        userId: number,
    ): Promise<CreateResourceResponse> {
        const project = await this.projectService.validateAndCheckExistence(projectId, userId, [
            'resources',
        ]);

        if (project.resources.length >= 20) {
            throw new MaximumResourceNumberException('Maximum number of resources reached');
        }

        const resource = project.resources.find((e) => e.name === dto.name);
        if (resource) {
            throw new ResourceExistsException('Resource with this name already exists');
        }

        const newResource = new ResourceEntity(dto.name, projectId);
        const primaryColumnField = new ResourceFieldEntity('id', FieldTypeEnum.PRIMARY_KEY);

        newResource.fields = [primaryColumnField];

        const result = await this.resourceRepository.save(newResource);

        return new CreateResourceResponse(result.publicId, result.name, result.fields);
    }
}

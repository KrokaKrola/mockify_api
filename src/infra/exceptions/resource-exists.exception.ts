import { NotFoundException } from '@nestjs/common';

export class ResourceExistsException extends NotFoundException {
    constructor(message?: string, descriptionOrOptions?: string | Record<string, any>) {
        super(message ?? 'Resource already exists', descriptionOrOptions);
    }
}

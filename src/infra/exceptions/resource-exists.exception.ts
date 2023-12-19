import { ConflictException } from '@nestjs/common';

export class ResourceExistsException extends ConflictException {
    constructor(message?: string, descriptionOrOptions?: string | Record<string, any>) {
        super(message ?? 'Resource already exists', descriptionOrOptions);
    }
}

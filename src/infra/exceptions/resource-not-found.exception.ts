import { NotFoundException } from '@nestjs/common';

export class ResourceNotFoundException extends NotFoundException {
    constructor(message?: string) {
        super(message ?? 'Resource not found');
    }
}

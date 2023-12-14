import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
    constructor(message?: string | object | unknown) {
        super(message ?? 'User not found');
    }
}

import { ConflictException } from '@nestjs/common';

export class MaximumResourceNumberException extends ConflictException {
    constructor(message?: string, descriptionOrOptions?: string | Record<string, any>) {
        super(message ?? 'Maximum resource number reached', descriptionOrOptions);
    }
}

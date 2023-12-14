import { ConflictException } from '@nestjs/common';

export class UserExistException extends ConflictException {}

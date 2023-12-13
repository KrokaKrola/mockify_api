import { User } from '@prisma/client';

export class UserEntity implements User {
    constructor(id: string, email: string, name: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public id: string;

    public email: string;

    public name: string;

    public createdAt: Date;

    public updatedAt: Date;
}

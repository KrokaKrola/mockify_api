import { User } from '@prisma/client';

export class UserEntity implements User {
    constructor(
        email: string,
        name: string,
        password: string,
        refreshToken?: string,
        id?: number,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.password = password;
        this.refreshToken = refreshToken;
    }

    public password: string;

    public deletedAt: Date;

    public id: number;

    public email: string;

    public name: string;

    public createdAt: Date;

    public updatedAt: Date;

    public refreshToken: string;
}

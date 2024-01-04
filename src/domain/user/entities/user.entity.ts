import { ProjectEntity } from '../../project/entities/project.entity';

export class UserEntity {
    constructor(email: string, name: string, password: string, refreshToken?: string) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.refreshToken = refreshToken ?? null;
    }

    public password: string;

    public deletedAt: Date;

    public id: number;

    public email: string;

    public name: string;

    public createdAt: Date;

    public updatedAt: Date;

    public refreshToken: string;

    public projects: ProjectEntity[];
}

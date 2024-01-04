import { IsAscii, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProjectRequest {
    @IsString()
    @MaxLength(128)
    @MinLength(2)
    @IsAscii()
    public name: string;

    constructor(name: string) {
        this.name = name;
    }
}

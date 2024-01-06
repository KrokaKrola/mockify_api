import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateResourceRequest {
    constructor(name: string) {
        this.name = name;
    }

    @IsString()
    @MinLength(3)
    @MaxLength(128)
    public name: string;
}

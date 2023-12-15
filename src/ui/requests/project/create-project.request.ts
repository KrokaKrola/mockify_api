import { IsAscii, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectRequest {
    @IsString()
    @MaxLength(128)
    @MinLength(2)
    @IsAscii()
    public name: string;
}

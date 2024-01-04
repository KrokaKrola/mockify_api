import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

import { Match } from '../../../infra/rest/validators/match.decorator';

export class SignUpRequest {
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    public email: string;

    @MaxLength(500)
    @IsOptional()
    public name: string;

    @IsNotEmpty()
    @MaxLength(64)
    @MinLength(8)
    public password: string;

    @IsNotEmpty()
    @MaxLength(64)
    @MinLength(8)
    @Match<SignUpRequest>('password')
    public passwordConfirmation: string;

    constructor(email: string, name: string, password: string, passwordConfirmation: string) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
    }
}

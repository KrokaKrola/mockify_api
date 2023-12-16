import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInRequest {
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    public email: string;

    @IsNotEmpty()
    @MaxLength(64)
    @MinLength(8)
    public password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

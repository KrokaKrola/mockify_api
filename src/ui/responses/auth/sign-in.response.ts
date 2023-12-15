export class SignInResponse {
    constructor(
        id: number,
        email: string,
        name: string,
        accessToken: string,
        refreshToken: string,
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public id: number;

    public email: string;

    public name: string;

    public accessToken: string;

    public refreshToken: string;
}

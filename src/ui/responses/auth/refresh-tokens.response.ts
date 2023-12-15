export class RefreshTokensResponse {
    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public accessToken: string;

    public refreshToken: string;
}

import * as crypto from 'node:crypto';
import { promisify } from 'node:util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const pbkdf2Async = promisify(crypto.pbkdf2);

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    public async hashValue(data: string): Promise<string> {
        return (
            await pbkdf2Async(data, this.configService.get('AUTH_HASH_SALT'), 1000, 127, 'sha512')
        ).toString('hex');
    }

    public async verifyHashValue(hashedData: string, data: string): Promise<boolean> {
        const hash = await this.hashValue(data);

        return hash === hashedData;
    }

    public async getTokens(
        userId: number,
        email: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                    expiresIn: '60m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
                    expiresIn: '30d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}

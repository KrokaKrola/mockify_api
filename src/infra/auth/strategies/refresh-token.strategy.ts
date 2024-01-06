import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_REFRESH_TOKEN_STRATEGY } from '../constants/strategy-names';

type JwtPayload = {
    sub: string;
    email: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, JWT_REFRESH_TOKEN_STRATEGY) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    public validate(
        req: Request,
        payload: JwtPayload,
    ): { id: string; email: string; refreshToken: string } {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

        return {
            id: payload.sub,
            email: payload.email,
            refreshToken,
        };
    }
}

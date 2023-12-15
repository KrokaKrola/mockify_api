import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_ACCESS_TOKEN_STRATEGY } from '../constants/strategy-names';

type JwtPayload = {
    sub: string;
    email: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, JWT_ACCESS_TOKEN_STRATEGY) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    public validate(payload: JwtPayload): { id: string; email: string } {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}

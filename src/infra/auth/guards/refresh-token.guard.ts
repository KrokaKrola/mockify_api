import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH_TOKEN_STRATEGY } from '../constants/strategy-names';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(JWT_REFRESH_TOKEN_STRATEGY) {}

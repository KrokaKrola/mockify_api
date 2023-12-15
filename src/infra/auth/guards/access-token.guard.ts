import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_STRATEGY } from '../constants/strategy-names';

@Injectable()
export class AccessTokenGuard extends AuthGuard(JWT_ACCESS_TOKEN_STRATEGY) {}

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { LogoutAction } from '../../application/user/actions/logout.action';
import { RefreshTokensAction } from '../../application/user/actions/refresh-tokens.action';
import { SignInAction } from '../../application/user/actions/sign-in.action';
import { SignUpAction } from '../../application/user/actions/sign-up.action';
import { AccessTokenGuard } from '../../infra/auth/guards/access-token.guard';
import { RefreshTokenGuard } from '../../infra/auth/guards/refresh-token.guard';
import { SignInRequest } from '../requests/auth/sign-in.request';
import { SignUpRequest } from '../requests/auth/sign-up.request';

import type { RefreshTokensResponse } from '../responses/auth/refresh-tokens.response';
import type { SignInResponse } from '../responses/auth/sign-in.response';
import type { SignUpResponse } from '../responses/auth/sign-up.response';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly signUpAction: SignUpAction,
        private readonly signInAction: SignInAction,
        private readonly logoutAction: LogoutAction,
        private readonly refreshTokensAction: RefreshTokensAction,
    ) {}

    @Post('sign-up')
    public async signUp(@Body() dto: SignUpRequest): Promise<SignUpResponse> {
        return this.signUpAction.execute(dto);
    }

    @Post('sign-in')
    public async signIn(@Body() dto: SignInRequest): Promise<SignInResponse> {
        return this.signInAction.execute(dto);
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async logout(@Req() req: Request): Promise<unknown> {
        return this.logoutAction.execute(req.user.id);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    public async refreshTokens(@Req() req: Request): Promise<RefreshTokensResponse> {
        return this.refreshTokensAction.execute(req);
    }
}

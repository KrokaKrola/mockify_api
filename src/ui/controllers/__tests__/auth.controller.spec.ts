import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { SignUpAction } from '../../../application/user/actions/sign-up.action';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from '../../../infra/auth/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '../../../infra/auth/strategies/refresh-token.strategy';
import { SignInAction } from '../../../application/user/actions/sign-in.action';
import { AuthService } from '../../../domain/user/services/auth.service';
import { UserRepository } from '../../../infra/database/repositories/user.repository';
import { LogoutAction } from '../../../application/user/actions/logout.action';
import { RefreshTokensAction } from '../../../application/user/actions/refresh-tokens.action';
import { SignUpRequest } from '../../requests/auth/sign-up.request';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { SignUpResponse } from '../../responses/auth/sign-up.response';
import { ResourceExistsException } from '../../../infra/exceptions/resource-exists.exception';

describe('AuthController', () => {
    let authController: AuthController;
    let userRepository: UserRepository;
    let authService: AuthService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [JwtModule.register({})],
            controllers: [AuthController],
            providers: [
                AccessTokenStrategy,
                RefreshTokenStrategy,
                SignUpAction,
                SignInAction,
                AuthService,
                UserRepository,
                LogoutAction,
                RefreshTokensAction,
                ConfigService,
                PrismaService,
            ],
        }).compile();

        authController = moduleRef.get<AuthController>(AuthController);
        userRepository = moduleRef.get<UserRepository>(UserRepository);
        authService = moduleRef.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('signUp', () => {
        it('should return a valid SignUpResponse', async () => {
            const signUpRequest = new SignUpRequest(
                'test@mail.com',
                'Test',
                '12345678',
                '12345678',
            );

            jest.spyOn(userRepository, 'create').mockImplementation(() => {
                return Promise.resolve({
                    id: 1,
                    email: 'test@mail.com',
                    name: 'Test',
                    password: '12345678',
                    refreshToken: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                });
            });

            const tokens = await authService.getTokens(1, signUpRequest.email);

            jest.spyOn(userRepository, 'update').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            jest.spyOn(authService, 'getTokens').mockImplementation(() => {
                return Promise.resolve(tokens);
            });

            const res = await authController.signUp(signUpRequest);

            expect(res).toEqual(
                new SignUpResponse(
                    1,
                    signUpRequest.email,
                    signUpRequest.name,
                    tokens.accessToken,
                    tokens.refreshToken,
                ),
            );
        });

        it('should throw an error if the user already exists', async () => {
            const signUpRequest = new SignUpRequest(
                'test@mail.com',
                'Test',
                '12345678',
                '12345678',
            );

            jest.spyOn(userRepository, 'findByEmail').mockImplementation(() => {
                return Promise.resolve({
                    id: 1,
                    email: 'test@mail.com',
                    name: 'Test',
                    password: '12345678',
                    refreshToken: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                });
            });

            try {
                await authController.signUp(signUpRequest);
            } catch (error) {
                expect(error.status).toEqual(404);
                expect(error.message).toEqual('User already exists');
                expect(error).toBeInstanceOf(ResourceExistsException);
            }
        });
    });
});

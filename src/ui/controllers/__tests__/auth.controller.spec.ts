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
import { SignInRequest } from '../../requests/auth/sign-in.request';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { SignInResponse } from '../../responses/auth/sign-in.response';
import { InvalidCredentialsException } from '../../../application/user/exceptions/invalid-credentials.exception';

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

            const updateMock = jest.spyOn(userRepository, 'update').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            jest.spyOn(authService, 'getTokens').mockImplementation(() => {
                return Promise.resolve(tokens);
            });

            const res = await authController.signUp(signUpRequest);

            const hashedRefreshToken = await authService.hashValue(tokens.refreshToken);

            expect(updateMock).toHaveBeenCalledWith({
                id: 1,
                refreshToken: hashedRefreshToken,
            });
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

    describe('signIn', () => {
        it('should return a valid SignInResponse', async () => {
            const signInRequest = new SignInRequest('test@mail.com', '12345678');

            jest.spyOn(userRepository, 'findByEmail').mockImplementation(() => {
                return Promise.resolve(
                    new UserEntity(
                        signInRequest.email,
                        'Test',
                        '29a4cac624cd2b3fcedd4b807db0c90ad1fe74bbd2e7ac7c861bbbd438a1fe7524c288f70c19e2a7c10f8c74999565dd8a4d3ce190b7ce456882017157766f303ab8339e1984965c358280e5b071941709a7e40aa47e1e311e665a03f749291068f69f66c5dfe45d2fa07dc93178fcc3afef20e05f0cfa8112c426f7bdd649',
                        null,
                        1,
                    ),
                );
            });

            const tokens = await authService.getTokens(1, signInRequest.email);

            jest.spyOn(authService, 'getTokens').mockImplementation(() => {
                return Promise.resolve(tokens);
            });

            const updateMock = jest.spyOn(userRepository, 'update').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            const response = await authController.signIn(signInRequest);

            const hashedRefreshToken = await authService.hashValue(tokens.refreshToken);

            expect(updateMock).toHaveBeenCalledWith({
                id: 1,
                refreshToken: hashedRefreshToken,
            });
            expect(response).toEqual(
                new SignInResponse(
                    1,
                    signInRequest.email,
                    'Test',
                    tokens.accessToken,
                    tokens.refreshToken,
                ),
            );
        });

        it('should throw an error if the user does not exist', async () => {
            const signInRequest = new SignInRequest('', '');

            jest.spyOn(userRepository, 'findByEmail').mockImplementation(() => {
                return Promise.resolve(null);
            });

            try {
                await authController.signIn(signInRequest);
            } catch (error) {
                expect(error.status).toEqual(401);
                expect(error.message).toEqual('Invalid credentials');
                expect(error).toBeInstanceOf(InvalidCredentialsException);
            }
        });

        it('should throw an error if invalid password was passed', async () => {
            const signInRequest = new SignInRequest('test@mail.com', '1234567');

            jest.spyOn(userRepository, 'findByEmail').mockImplementation(() => {
                return Promise.resolve(
                    new UserEntity(
                        signInRequest.email,
                        'Test',
                        '29a4cac624cd2b3fcedd4b807db0c90ad1fe74bbd2e7ac7c861bbbd438a1fe7524c288f70c19e2a7c10f8c74999565dd8a4d3ce190b7ce456882017157766f303ab8339e1984965c358280e5b071941709a7e40aa47e1e311e665a03f749291068f69f66c5dfe45d2fa07dc93178fcc3afef20e05f0cfa8112c426f7bdd649',
                        null,
                        1,
                    ),
                );
            });

            try {
                await authController.signIn(signInRequest);
            } catch (error) {
                expect(error.status).toEqual(401);
                expect(error.message).toEqual('Invalid credentials');
                expect(error).toBeInstanceOf(InvalidCredentialsException);
            }
        });
    });
});

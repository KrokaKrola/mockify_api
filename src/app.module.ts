import { Logger, Module } from '@nestjs/common';
import { AppConfigModule } from './infra/ioc/app-config/app-config.module';
import { loggingMiddleware, PrismaModule, QueryInfo } from 'nestjs-prisma';
import { AuthModule } from './infra/ioc/auth/auth.module';

@Module({
    imports: [
        AppConfigModule,
        PrismaModule.forRoot({
            isGlobal: true,
            prismaServiceOptions: {
                prismaOptions: {
                    log: [
                        {
                            emit: 'event',
                            level: 'query',
                        },
                    ],
                },
                middlewares: [
                    loggingMiddleware({
                        logger: new Logger('PrismaMiddleware'),
                        logLevel: 'debug',
                        logMessage: (query: QueryInfo) => {
                            return `🟣 ${query.model}.${query.action} - ${query.executionTime}ms`;
                        },
                    }),
                ],
            },
        }),
        AuthModule,
    ],
})
export class AppModule {}

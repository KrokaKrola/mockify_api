import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './infra/rest/interceptors/logging.interceptor';
import { ValidationTransformPipe } from './infra/rest/pipes/validation-transform.pipe';

async function bootstrap(): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    Logger.log(
        `Application is running in mode: ${chalk.hex('#e3fc17').bold(configService.get('APP_ENV'))}`,
        'Bootstrap',
    );

    app.use(helmet());
    app.use(cookieParser());
    app.use(bodyParser.json({ limit: '50mb' }));

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalPipes(new ValidationTransformPipe());

    await app.listen(configService.get('APP_PORT') || 3000);

    return app;
}

bootstrap()
    .then(async (app: INestApplication) => {
        const configService = app.get(ConfigService);

        Logger.log(
            `Application is running on: http://${configService.get('APP_HOST')}:${configService.get('APP_PORT')}`,
            'Bootstrap',
        );
    })
    .catch((err) => {
        if (err instanceof Error) {
            Logger.error(`Application bootstrap error: ${err.message}`, err.stack, 'Bootstrap Error');
        } else {
            Logger.error(`Application bootstrap error: ${err}`, '', 'Bootstrap');
        }
    });

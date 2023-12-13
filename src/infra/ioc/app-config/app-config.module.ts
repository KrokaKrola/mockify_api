import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfigSchema } from './app-config.schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            validationSchema: appConfigSchema,
        }),
    ],
})
export class AppConfigModule {}

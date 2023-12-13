import { Module } from '@nestjs/common';
import { AppConfigModule } from './infra/ioc/app-config/app-config.module';
import { TestController } from './ui/controllers/test.controller';

@Module({
    imports: [AppConfigModule],
    controllers: [TestController],
    providers: [],
    exports: [],
})
export class AppModule {}

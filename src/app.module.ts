import { Module } from '@nestjs/common';

import { PostgresModule } from './infra/database/postgres/postgres.module';
import { AppConfigModule } from './infra/ioc/app-config/app-config.module';
import { AuthModule } from './infra/ioc/auth/auth.module';
import { ProjectsModule } from './infra/ioc/projects/projects.module';

@Module({
    imports: [AppConfigModule, PostgresModule, AuthModule, ProjectsModule],
})
export class AppModule {}

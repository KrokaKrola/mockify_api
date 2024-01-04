import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const PostgresModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),

        entities: ['dist/infra/database/postgres/mappers/**/*.js'],

        synchronize: false,

        logging: configService.get('APP_ENV') === 'local',
        logger: 'file',

        migrationsRun: true,
        migrationsTableName: 'migrations',
        migrations: ['dist/infra/database/postgres/migrations/*.js'],
    }),
    inject: [ConfigService],
    dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options);
        await dataSource.initialize();

        return dataSource;
    },
});

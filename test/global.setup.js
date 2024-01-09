import { GenericContainer } from 'testcontainers';

export default async () => {
    let container;

    try {
        console.log('Starting PostgresSQL container...');

        container = await new GenericContainer('postgres:latest')
            .withExposedPorts({
                container: 5432,
                host: 5435,
            })
            .withEnvironment({
                POSTGRES_DB: 'mockify_db',
                POSTGRES_USER: 'mockify_u',
                POSTGRES_PASSWORD: 'mockify_p',
            })
            .start();

        console.log('PostgresSQL container started successfully.');
    } catch (error) {
        console.error('Error starting PostgresSQL container:', error);

        throw error;
    }

    global.testContext = {
        container,
    };
};

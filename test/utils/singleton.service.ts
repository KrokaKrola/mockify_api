import { GenericContainer } from 'testcontainers';

import type { StartedTestContainer } from 'testcontainers';

let container: StartedTestContainer;

async function initContainer(): Promise<StartedTestContainer> {
    console.log('Starting PostgresSQL container...');

    try {
        const c = await new GenericContainer('postgres:latest')
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

        console.log('PostgreSQL container started successfully.');

        return c;
    } catch (error) {
        console.error('Error starting PostgreSQL container:', error);

        throw error;
    }
}

(async (): Promise<void> => {
    container = await initContainer();
})();

export { container };

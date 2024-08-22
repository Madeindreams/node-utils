import pg from 'pg'
const { Pool } = pg

interface PgDatabaseSettings {
    user: string;
    host: string;
    database: string;
    password: string;
    port?: number;
}

class PgDatabase {
    private pool: Pool;

    constructor(settings: PgDatabaseSettings) {
        this.pool = new Pool({
            user: settings.user,
            host: settings.host,
            database: settings.database,
            password: settings.password,
            port: settings.port || 5432,
        });
    }

    public async query(text: string, params?: any[]) {
        const client = await this.pool.connect();
        try {
            return await client.query(text, params);
        } finally {
            client.release();
        }
    }

    public async close() {
        await this.pool.end();
    }
}

export { PgDatabase, PgDatabaseSettings };

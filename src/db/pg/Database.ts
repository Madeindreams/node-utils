import { Pool } from 'pg';

interface DatabaseSettings {
    user: string;
    host: string;
    database: string;
    password: string;
    port?: number;
    ssl?: boolean;
}

class Database {
    private pool: Pool;

    constructor(settings: DatabaseSettings) {
        this.pool = new Pool({
            user: settings.user,
            host: settings.host,
            database: settings.database,
            password: settings.password,
            port: settings.port || 5432,
            ssl: settings.ssl || false,
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

export { Database, DatabaseSettings };

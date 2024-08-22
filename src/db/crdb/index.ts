import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

interface DatabaseSettings {
    user: string;
    host: string;
    database: string;
    password: string;
    port?: number;
    ssl?: boolean;  // Add SSL option
    sslCertPath?: string; // Optional path to SSL cert files
}

class Database {
    private pool: Pool;

    constructor(settings: DatabaseSettings) {
        const sslConfig = settings.ssl
            ? {
                rejectUnauthorized: true,
                ca: settings.sslCertPath
                    ? fs.readFileSync(path.resolve(settings.sslCertPath, 'ca.crt')).toString()
                    : undefined,
                key: settings.sslCertPath
                    ? fs.readFileSync(path.resolve(settings.sslCertPath, 'client.key')).toString()
                    : undefined,
                cert: settings.sslCertPath
                    ? fs.readFileSync(path.resolve(settings.sslCertPath, 'client.crt')).toString()
                    : undefined,
            }
            : undefined;

        this.pool = new Pool({
            user: settings.user,
            host: settings.host,
            database: settings.database,
            password: settings.password,
            port: settings.port || 26257, // Default CockroachDB port is 26257
            ssl: sslConfig, // Add SSL configuration
        });
    }

    public async query(text: string, params?: any[]) {
        const client = await this.pool.connect();
        try {
            return await client.query(text, params);
        } catch (error) {
            console.error('Database query error:', error);
            throw error; // Re-throw the error to be handled by the caller
        } finally {
            client.release();
        }
    }
    public async close() {
        await this.pool.end();
    }
}

export { Database, DatabaseSettings };

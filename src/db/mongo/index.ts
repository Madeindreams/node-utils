import { MongoClient, Db } from 'mongodb';

interface MongoDBSettings {
    uri: string;
    dbName: string;
}

class Database {
    private client: MongoClient;
    private db?: Db;

    constructor(private settings: MongoDBSettings) {
        this.client = new MongoClient(this.settings.uri);
    }

    public async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(this.settings.dbName);
            console.log(`Connected to MongoDB: ${this.settings.dbName}`);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    public getDatabase(): Db {
        if (!this.db) {
            throw new Error('Database connection is not established. Call connect() first.');
        }
        return this.db;
    }

    public async disconnect(): Promise<void> {
        try {
            await this.client.close();
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }
}

export { Database, MongoDBSettings };

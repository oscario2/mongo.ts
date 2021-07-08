import { MongoClient } from '../../deps.ts';
import { TMongoDatabase } from './mongo-types.ts';

const env = Deno.env.toObject();

export class MongoContext {
    private static client: MongoClient;

    private static async getClient() {
        if (!this.client) {
            const client = new MongoClient();
            await client.connect(env.MONGO || 'mongodb://127.0.0.1:27017');
            this.client = client; // reuse existing connection for pooling
        }
        return this.client;
    }

    public static async getCollection<T>({ db, collection }: TMongoDatabase) {
        const client = await this.getClient();
        return client.database(db).collection<T>(collection.toString());
    }
}

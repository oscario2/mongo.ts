import { Collection, Document, FindOptions } from '../../deps.ts';
import { MongoContext } from './mongo-context.ts';
import { TMongoDatabase } from './mongo-types.ts';

export class MongoService<T> {
    private constructor(private readonly storage: Collection<T>) {}

    /**
     *
     * @param query
     * @returns
     */
    public async insert(query: Document): Promise<boolean> {
        const result = await this.storage.insertOne(query);
        if (!result) {
            return false;
        }
        return true;
    }

    /**
     *
     * @param query
     * @param filter
     * @returns
     */
    public async updateOne(
        query: Document,
        filter: FindOptions
    ): Promise<number[]> {
        const { matchedCount, modifiedCount } = await this.storage.updateOne(
            filter,
            query,
            { upsert: true } // add if not exist
        );
        return [matchedCount, modifiedCount];
    }

    /**
     *
     * @param query
     * @param projection
     * @returns
     */
    public async findOne(query: Document, projection: FindOptions): Promise<T> {
        const result = await this.storage.findOne(query, projection);

        if (result == undefined) {
            return {} as T;
        }
        return result as T;
    }

    /**
     *
     */
    public async clear() {
        console.log(`Clearing storage ${this.storage.name}`);
        await this.storage.deleteMany({});
    }

    public static async from<T>(db: TMongoDatabase): Promise<MongoService<T>> {
        // TODO: more extensive validation @oscario2
        const storage = await MongoContext.getCollection<T>(db);
        return new MongoService<T>(storage);
    }
}

import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { FindOptions } from '../deps.ts';
import { mongoHelper } from '../src/mongo/mongo-helper.ts';
import { IDemoUser, MongoTestHelper } from './mongo-test-helper.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2();
const test = new MongoTestHelper();

/*
$ use test
$ show collections
$ db.users.find()
*/

await describe('Mongo', async () => {
    const db = await test.getRepository({
        db: 'test',
        collection: 'users'
    });

    it('should insert item', async () => {
        db.clear();

        const user = test.getDemoUser();
        expect(await db.insert(user)).toBe(true);
    });

    it('should update item', async () => {
        const query = {
            info: { age: 50 }
        } as IDemoUser;

        const filter = {
            name: 'John'
        } as IDemoUser;

        // use 'dot notation' for update or we'll replace the existing object
        const dot = { $set: mongoHelper.toDotNotation(query) };
        const [, modified] = await db.updateOne(dot, filter as FindOptions);
        expect(modified).toBe(1);
    });

    it('should find item', async () => {
        const { name } = test.getDemoUser();

        const query = {
            name
        } as IDemoUser;

        const filter = {
            name: '',
            info: { age: 0 }
        } as IDemoUser;

        const projection = {
            projection: mongoHelper.toProjection(filter)
        };

        const res =
            ((await db.findOne(query, projection)) as { name: string }) ||
            undefined;
        expect('name' in res && 'info' in res).toBe(true);
    });
}).run();

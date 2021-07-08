import { MongoService, TMongoDatabase } from '../index.ts';

enum EDemoRole {
    User
}

export interface IDemoUser {
    name: string;
    info: { age: number; role: EDemoRole };
}

export class MongoTestHelper {
    public async getRepository(db: TMongoDatabase) {
        return await MongoService.from(db);
    }

    public getDemoUser(): IDemoUser {
        return {
            name: 'John',
            info: {
                age: 25,
                role: EDemoRole.User
            }
        } as IDemoUser;
    }
}

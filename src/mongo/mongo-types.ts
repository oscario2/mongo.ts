export type TMongoTestCollection = 'users';
export type TMongoCollection = 'block' | 'receipt' | 'logs';

// TODO: find a way to type guard collection depending on db @oscario2
export type TMongoDatabase =
    | { db: 'test'; collection: TMongoTestCollection }
    | { db: 'blockchain'; collection: TMongoCollection };

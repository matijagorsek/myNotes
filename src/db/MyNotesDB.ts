import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_DB_URI as string;
const dbName = 'MyNotesDB';
let client = new MongoClient(url);

class MyNotesDB {
    constructor() {
        client = new MongoClient(url);
    }

    async connect() {
        await client.connect();
    }

    async disconnect() {
        await client.close();
    }

    get dataBaseInstance() {
        return client.db(dbName);
    }
}

const db = new MyNotesDB();

export default db;
import { MongoClient, ServerApiVersion } from 'mongodb';

const url = 'mongodb+srv://matijagorshek:test1234@cluster0.zox0ftb.mongodb.net/?retryWrites=true&w=majority';
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
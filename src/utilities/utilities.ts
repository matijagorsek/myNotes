import { ObjectId } from 'mongodb';

export function generateUniqueId(): ObjectId {
    return new ObjectId();
}

export function getTimestamp(): number {
    return new Date().getTime()
}
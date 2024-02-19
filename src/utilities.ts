import { v4 as uuidv4 } from 'uuid';

export function generateUniqueId(): string {
    return uuidv4();
}

export function getTimestamp(): number {
   return new Date().getTime()
}
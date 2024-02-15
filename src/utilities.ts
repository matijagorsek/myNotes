export function generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
}

export function getTimestamp(): number {
   return new Date().getTime()
}
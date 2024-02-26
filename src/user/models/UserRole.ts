enum UserRole {
    ADMIN = 'admin',
    SUPERVISOR = 'supervisor',
    USER = 'user',
    UNKNOWN = 'unknown'
}

export function toUserRole(value: string): UserRole {
    switch (value) {
        case 'admin': return UserRole.ADMIN;
        case 'supervisor': return UserRole.SUPERVISOR;
        case 'user': return UserRole.USER;
        default: return UserRole.UNKNOWN;
    }
}

export function fromUserRole(role: UserRole): string {
    return role;
}

export default UserRole
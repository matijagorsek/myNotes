interface User {
    id: string;
    firstName: string;
    lastName: string;
    email : string;
    password: string;
    userRole: UserRole.UNKNOWN;
    gender: UserGender.UNKNOWN;
}

export default User;
import { ObjectId } from "mongodb";

interface User {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email : string;
    password: string;
    userRole: UserRole.UNKNOWN;
    gender: UserGender.UNKNOWN;
}

export default User;
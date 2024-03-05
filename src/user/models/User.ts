import { ObjectId } from "mongodb";
import { UserGender } from "./UserGender";
import UserRole from "./UserRole";

interface User {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userRole: UserRole;
    gender: UserGender;
    verified: false
}

export default User;
import User from "../models/User"

export interface UserRepo {
    fetchAllUsers(): Promise<User[]>
    checkIfUserExist(email: string): Promise<boolean>
    createUser(user: User): Promise<User>
    loginUser(email: string, password: string): Promise<[boolean, User]>
    deleteUser(userId: string): Promise<void>
    deleteAllUsers(): Promise<void>
}
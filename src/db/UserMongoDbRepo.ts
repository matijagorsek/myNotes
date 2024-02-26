import { ObjectId } from "mongodb";
import User from "../user/models/User";
import { userCollection } from "./DBConstants";
import db from "./MyNotesDB";
import bcrypt from 'bcrypt';
import { UserRepo } from "../user/repo/UserRepo";

export default class UserMongoDbRepo implements UserRepo {

  async loginUser(email: string, password: string): Promise<[boolean, User]> {
    const user = await this.collection.findOne({ email: email }) as User
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        console.log('Passwords matched')
        return ([true, user])
      } else {
        console.log('Passwords not matched')
        return ([false, user])
      }
    }
    return ([false, user])
  }

  private readonly collection = db.dataBaseInstance.collection(userCollection);

  async checkIfUserExist(email: string): Promise<boolean> {
    const user = await this.collection.findOne({ email: email })
    if (user) {
      return true
    }
    return false
  }

  async fetchAllUsers(): Promise<User[]> {
    return await this.collection.find().toArray() as User[]
  }

  async createUser(user: User): Promise<User> {
    this.collection.insertOne(user)
    return user
  }

  async deleteUser(userId: string): Promise<void> {
    this.collection.deleteOne({ _id: new ObjectId(userId) })
  }


  async deleteAllUsers(): Promise<void> {
    this.collection.deleteMany()
  }


}
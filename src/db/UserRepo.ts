import { ObjectId } from "mongodb";
import User from "../user/models/User";
import { userCollection } from "./DBConstants";
import db from "./MyNotesDB";
import bcrypt from 'bcrypt';

const database = db.dataBaseInstance;

export async function saveUserToDB(user: User) {
  try {
    const hashedPassword = await bcrypt.hash(user.password, user.password.length)
    user.password = hashedPassword
    await database.collection(userCollection).insertOne(user);
    console.log('User created successfully');
  } catch (error) {
    console.log('Error creating user:', error);
  }
}

export async function loginUserWithDb(email: string, password: string): Promise<[boolean, ObjectId]> {
  const user = await database.collection(userCollection).findOne({ email: email })
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      console.log('Passwords matched')
      return ([true, user._id])
    } else {
      console.log('Passwords not matched')
      return ([false, user._id])
    }
  }
  return ([false, new ObjectId])
}

export async function getAllUsers(): Promise<[boolean, any[]]> {
  try {
    const users = await database.collection(userCollection).find().toArray();
    return ([true, users])
  } catch (error) {
    return ([false, []])
  }
};

export async function checkIfUserExist(email: string): Promise<boolean> {
  const user = await database.collection(userCollection).findOne({ email: email })
  if (user) {
    return true
  }
  return false
}
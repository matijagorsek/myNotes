import Note from "../note/models/Note";
import User from "../user/models/User";
import { notesCollection, userCollection } from "./DBConstants";
import db from "./MyNotesDB";

const database = db.dataBaseInstance;

export async function saveNoteToDB(noteData: Note) {
  try {
    await database.collection(notesCollection).insertOne(noteData);
    console.log('Note created successfully');
  } catch (error) {
    console.log('Error creating note:', error);
  }
}
import { ObjectId } from "mongodb";
import Note from "../note/models/Note";
import { notesCollection } from "./DBConstants";
import db from "./MyNotesDB";

const collection = db.dataBaseInstance.collection(notesCollection);

export async function saveNoteToDB(noteData: Note) {
  try {
    await collection.insertOne(noteData);
    console.log('Note created successfully');
  } catch (error) {
    console.log('Error creating note:', error);
  }
}

export async function checkIfNoteExist(noteId: string): Promise<Note | null> {
  const note = await collection.findOne({ _id: new ObjectId(noteId) });
  if (note) return note as Note
  else return null
}

export async function fetchAllNotesFromDb(): Promise<Note[]> {
  const notes = await collection.find().toArray()
  return notes as Note[];
}

export async function updateNoteInTheDB(content: string, noteId: string, updatedAt: number) {
  await collection.updateOne({ _id: new ObjectId(noteId) }, { $set: { content: content, updatedAt: updatedAt } })
}

export async function fetchUsersNotes(authorId: string): Promise<Note[]> {
  const allNotes = await collection.find().toArray()
  console.log('Filtered all notes', allNotes)
  const notes = await collection.find({ authorId: authorId }).toArray()
  console.log('Filtered notes:', notes)
  return notes as Note[]
}

export async function deleteNoteFromDb(noteId:string): Promise<boolean> {
  const note = checkIfNoteExist(noteId)
  if(!note){
    return false
  }else{
    const deleteNote = await collection.findOneAndDelete({ _id: new ObjectId(noteId) });
    if (deleteNote) return true
  }
  return false
}
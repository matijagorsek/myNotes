import { ObjectId } from "mongodb";
import Note from "../note/models/Note";
import { notesCollection } from "./DBConstants";
import db from "./MyNotesDB";
import { NoteRepo } from "../note/repo/NoteRepo";

export default class NotesMongoDbRepo implements NoteRepo {

  private readonly collection = db.dataBaseInstance.collection(notesCollection);

  async fetchAllNotes(): Promise<Note[]> {
    const notes = await this.collection.find().toArray()
    return notes as Note[];
  }

  async fetchUsersNotes(authorId: string): Promise<Note[]> {
    const allNotes = await this.collection.find().toArray()
    console.log('Filtered all notes', allNotes)
    const notes = await this.collection.find({ authorId: authorId }).toArray()
    console.log('Filtered notes:', notes)
    return notes as Note[]
  }

  async fetchNote(noteId: string): Promise<Note | null> {
    const note = await this.collection.findOne({ _id: new ObjectId(noteId) });
    if (note) return note as Note
    else return null
  }

  async saveNote(note: Note): Promise<void> {
    try {
      await this.collection.insertOne(note);
      console.log('Note created successfully');
    } catch (error) {
      console.log('Error creating note:', error);
    }
  }

  async updateNote(noteId: string, newContent: string, updatedAt: number): Promise<void> {
    await this.collection.updateOne({ _id: new ObjectId(noteId) }, { $set: { content: newContent, updatedAt: updatedAt } })
  }

  async deleteNote(noteId: string): Promise<boolean> {
    const note = this.checkIfNoteExist(noteId)
    if (!note) {
      return false
    } else {
      const deleteNote = await this.collection.findOneAndDelete({ _id: new ObjectId(noteId) });
      if (deleteNote) return true
    }
    return false
  }

  async checkIfNoteExist(noteId: string): Promise<Note | null> {
    const note = await this.collection.findOne({ _id: new ObjectId(noteId) });
    if (note) return note as Note
    else return null
  }

}




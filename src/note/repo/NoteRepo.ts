import Note from "../models/Note"

export interface NoteRepo {

    fetchAllNotes(): Promise<Note[]>
    fetchUsersNotes(authorId: string): Promise<Note[]>
    checkIfNoteExist(noteId:string) : Promise<Note | null>
    fetchNote(noteId: string): Promise<Note | null>
    saveNote(note: Note): Promise<void>
    updateNote(noteId: string, newContent: string, updatedAt: number): Promise<void>
    deleteNote(noteId: string): Promise<Boolean>
}
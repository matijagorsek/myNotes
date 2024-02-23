import { ObjectId } from "mongodb";

interface Note {
  _id: ObjectId;
  content: string;
  createdAt: number;
  updatedAt: number;
  authorId: string;
}

export default Note;
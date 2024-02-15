# MyNotes App

MyNotes is a simple Node.js backend application written in TypeScript. It provides endpoints to manage notes, including creating, updating, deleting, and fetching notes.

## Features

- Create a new note with text and authorId
- Update an existing note
- Delete a note
- Fetch all notes
- Fetch notes by authorId

### Endpoints

- **POST /notes**: Create a new note. Requires `content` and `authorId` in the request body.
- **PUT /notes/:id**: Update an existing note with the specified ID. Requires `content` in the request body.
- **DELETE /notes/:id**: Delete the note with the specified ID.
- **GET /notes**: Fetch all notes.
- **GET /notes/byAuthor?authorId=:authorId**: Fetch notes by authorId.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you encounter any problems or have suggestions for improvements.



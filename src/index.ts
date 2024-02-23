import express from 'express';
import userRoutes from './user/routes/UserRoutes'
import bodyParser from 'body-parser';
import noteRoutes from './note/routes/NoteRoutes';
import db from './db/MyNotesDB';
import dotenv from 'dotenv';

dotenv.config();

export const tokenApiKey = process.env.TOKEN_SECRET as string
export const refreshTokenApiKey = process.env.REFRESH_TOKEN_SECRET as string
const app = express();
const PORT = 3000;


db.connect().then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(bodyParser.json());

app.use('/notes', noteRoutes);
app.use('/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

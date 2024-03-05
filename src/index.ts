import express from 'express';
import userApi from './user/api/UserApi'
import bodyParser from 'body-parser';
import noteApi from './note/api/NoteApi';
import db from './db/MyNotesDB';
import dotenv from 'dotenv';

dotenv.config();

export const mailerMail = process.env.EMAIL_USERNAME as string
export const mailerPass = process.env.EMAIL_PASSWORD as string
export const tokenApiKey = process.env.TOKEN_SECRET as string
const app = express();
const PORT = 3000;


db.connect().then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(bodyParser.json());

app.use('/notes', noteApi);
app.use('/users', userApi)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

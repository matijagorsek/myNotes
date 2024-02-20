import express from 'express';
import userRoutes from './user/routes/UserRoutes'
import bodyParser from 'body-parser';
import noteRoutes from './note/routes/NoteRoutes';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/notes', noteRoutes);
app.use('/users',userRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
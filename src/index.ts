import express from 'express';
import noteRoutes from './routes/NoteRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/notes', noteRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
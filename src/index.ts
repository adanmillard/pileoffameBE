import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboard from './routes/dashboard';
import type { Request, Response } from 'express';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({message:" Welcome to the Pile of Shame Backend!"});
});

app.use('/dashboard', dashboard);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import dotenv from 'dotenv';
import express from 'express';
import chatRouter from "./routes/chat.routes";
import {errorHandler} from "./middlewares/error.middleware";

dotenv.config();
const app = express();
const port = 3008;

app.use(express.json());
app.use('/api', chatRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

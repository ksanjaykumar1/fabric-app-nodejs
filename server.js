import 'express-async-errors';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const { PORT } = process.env;

const app = express();
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
const port = PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

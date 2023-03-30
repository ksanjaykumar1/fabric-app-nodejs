import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/error-handler.js';
import { fabricSetup } from './utils/fabric-setup.js';
import identity from './routes/identity.js'

const { PORT } = process.env;
const app = express();
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api/v1/identity', identity)
app.use(notFound);
app.use(errorHandler);

const port = PORT || 3000;

const start = async () => {
  try {
    await fabricSetup()
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
};

start();
